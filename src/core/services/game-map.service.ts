import { IGame, IMappedGame, IMappedGameChanges } from "../interfaces/game.interface";
import { IMappedPlayers } from "../interfaces/mapped-players.interface";
import { IPlayer, ISecuredPlayer } from "../interfaces/player.interface";
import { IRoom } from "../interfaces/room.interface";
import { RoomService } from "./room.service";
import { socketIO } from "../../app";
import { WebsocketCommunication } from "../websocket/communication/websocket.communication";
import { GAME_EVENTS } from "../enums/game-events.enum";
import { IDistributeCardsWebsocketResponse } from "../interfaces/response.interface";
import { PLAYER_POSITION } from "../enums/player-position.enum";

interface IPlayerSocket {
  playerId: string;
  socketId: string;
}

/**
 * * Handles emitting events from-single-player|backend to single|multiple-players once the game has started.
 * * Converts IGame to IMappedGame.
 * * Broadcasts events and also emit events to individual players.
 * 
 * * This class can be considered as a single place to catch all events emitted to frontend once the game has started.
 */
export class GameMapService {

  /**
   * * Get the current game state.
   * * Used for 'on refresh'.
   */
  public static getGameState(playerId: string, room: IRoom): IMappedGame {
    const mappedGame: IMappedGame = {
      isGameStarted: room.game.isGameStarted,
      lastDrawnCard: room.game.lastDrawnCard,
      currentDirection: room.game.currentDirection,
      currentColor: room.game.currentColor,
      // currentPlayer: {
      //   player: ,
      //   position: ,
      // }, // TODO
      mappedPlayers: GameMapService._mapToMappedPlayers(playerId, room.game.players),
    };
    return mappedGame;
  }

  /**
   * * Broadcasts game state to room players after mapping opponent positions for each player.
   * * Each IMappedPlayers object is sent to respective player's socketId.
   * * One by one response is emitted to each of the players of the affected room.
   * 
   * 1. Fetch socketIds from REDIS ('identities') of all players in the room and Store socketIds in IPlayerSocket[].
   * 2. Iterate through players list.
   *  > * i. Generate IMappedPlayers.
   *  > * ii. Emit 'distribute' event with response to iterated player's socketId.
   * 
   * * Usecase: On distribute cards after cards-shuffled.
   * * After this event, 'discard-first-card' is invoked.
   */
  public static async broadcastGameStateOnDistributeCards(room: IRoom) {
    const playerSockets: IPlayerSocket[] = await GameMapService._fetchSocketIds(room.game.players);

    playerSockets.forEach(e => {
      const mappedGame: IMappedGame = {
          isGameStarted: room.game.isGameStarted,
          mappedPlayers: GameMapService._mapToMappedPlayers(e.playerId,room.game.players),
      };
      const response: IDistributeCardsWebsocketResponse = {
        hostPosition: GameMapService._getHostPosition(room, mappedGame),
        mappedGame: mappedGame,
      };
      const clientSocket = socketIO.sockets.sockets.get(e.socketId);
      if (clientSocket) {
        WebsocketCommunication.emitToSocket(clientSocket, GAME_EVENTS.distributeCards, response);
        console.log('event emitted to ' + e.socketId);
      } else {
        // TODO remove error part if creates further breakdown
        throw new Error("broadcastGameStateOnDistributeCards() socket ("+ e.socketId +") is missing!");
      }
    });
  }

  /**
   * * Broadcasts 'discard-first-card' to room players after 'distribute-cards' event.
   * * Each IMappedGameChanges object is sent to respective player's socketId.
   * * One by one response is emitted to each of the players of the affected room.
   * 
   * 1. Fetch socketIds from REDIS ('identities') of all players in the room and Store socketIds in IPlayerSocket[].
   * 2. Iterate through players list.
   *  > * i. Emit 'discard-first-card' event with response to iterated player's socketId.
   * 
   * Usecase: On discardFirstCard after cards-distributed.
   */
  public static async broadcastDiscardFirstCardEvent(game: IGame) {
    const playerSockets: IPlayerSocket[] = await GameMapService._fetchSocketIds(game.players);

    if (game.lastDrawnCard) {
      const response: IMappedGameChanges = {
        lastDrawnCard: game.lastDrawnCard,
        ...(game.currentColor && { currentColor: game.currentColor }),
        ...(game.currentDirection && {currentDirection: game.currentDirection}),
      };

      playerSockets.forEach(e => {
        const clientSocket = socketIO.sockets.sockets.get(e.socketId);
        if (clientSocket) {
          WebsocketCommunication.emitToSocket(clientSocket, GAME_EVENTS.discardFirstCard, response);
        } else {
          // TODO remove error part if creates further breakdown
          throw new Error("broadcastDiscardFirstCardEvent() socket ("+ e.socketId +") is missing!");
        }
      });

    } else { throw new Error("lastDrawnCard is not present!"); }
  }

  /**
   * * Takes a player who's turn is to receive the game state.
   * * Maps in the form of IMappedPlayers so that frontend can map
   * position of opponents accordingly.
   * 
   * * Always travel from left to right. Because players are inserted in QUEUE fashion (Array.push).
   * 
   * * Examples
   * 1. i/p: [{ id: 123 }, { id: 45 }, { id: 67 }, { id: 89 }]
   * > for id = 45
   * > o/p: { left: { id: 67 }, top: { id: 89 }, right: { id: 123 }, bottom: { id: 45 } }
   * 
   * > for id = 67
   * > o/p: { left: { id: 89 }, top: { id: 123 }, right: { id: 45 }, bottom: { id: 67 } }
   * 
   * > for id = 89
   * > o/p: { left: { id: 123 }, top: { id: 45 }, right: { id: 67 }, bottom: { id: 89 } }
   * 
   * 2. i/p: [{ id: 123 }, { id: 45 }, { id: 67 }]
   * > for id = 45
   * > o/p: { left: { id: 67 }, top: null, right: { id: 123 }, bottom: { id: 45 } }
   * 
   * > for id = 67
   * > o/p: { left: { id: 123 }, top: null, right: { id: 45 }, bottom: { id: 67 } }
   * 
   * 3. i/p: [{ id: 123 }, { id: 45 }]
   * > for id = 45
   * > o/p: { left: null, top: { id: 123 }, right: null, bottom: { id: 45 } } 
   */
  private static _mapToMappedPlayers(playerId: string, players: IPlayer[]): IMappedPlayers {
    const me: IPlayer | undefined = players.find(e => e.id == playerId);
    const TOTAL_PLAYERS: number = players.length;
    if (me) {
      let topPlayer: ISecuredPlayer | null = null;
      let leftPlayer: ISecuredPlayer | null = null;
      let rightPlayer: ISecuredPlayer | null = null;

      const myIndex: number = players.findIndex(e => e.id == playerId);
      let currentIndex: number = myIndex;
      switch (TOTAL_PLAYERS) {
        case 2:
          leftPlayer = null;
          topPlayer = (myIndex == 0)
            ? GameMapService._mapToSecuredPlayer(players[1])
            : GameMapService._mapToSecuredPlayer(players[0]);
          rightPlayer = null;
          break;
        case 3:
          if (++currentIndex >= TOTAL_PLAYERS) { currentIndex = 0; }
          leftPlayer = GameMapService._mapToSecuredPlayer(players[currentIndex]);
          topPlayer = null;
          if (++currentIndex >= TOTAL_PLAYERS) { currentIndex = 0; }
          rightPlayer = GameMapService._mapToSecuredPlayer(players[currentIndex]);
          break;
        case 4:
          if (++currentIndex >= TOTAL_PLAYERS) { currentIndex = 0; }
          leftPlayer = GameMapService._mapToSecuredPlayer(players[currentIndex]);
          if (++currentIndex >= TOTAL_PLAYERS) { currentIndex = 0; }
          topPlayer = GameMapService._mapToSecuredPlayer(players[currentIndex]);
          if (++currentIndex >= TOTAL_PLAYERS) { currentIndex = 0; }
          rightPlayer = GameMapService._mapToSecuredPlayer(players[currentIndex]);
          break;
      }
      const mappedPlayers: IMappedPlayers = {
        top: topPlayer,
        left: leftPlayer,
        bottom: me,
        right: rightPlayer,
      };
      return mappedPlayers;
    } else throw new Error('GameMapService > player not found');
  }

  private static _mapToSecuredPlayer(player: IPlayer): ISecuredPlayer {
    return <ISecuredPlayer>{
      cardsCount: player.cards.length,
      id: player.id,
      isActive: player.isActive,
      isCardLeft: player.isCardLeft,
      name: player.name,
      score: player.score,
    };
  }

  private static async _fetchSocketIds(players: IPlayer[]): Promise<IPlayerSocket[]> {
    const playerSockets: IPlayerSocket[] = [];
    for (let player of players) {
      const socketId: string | null = await RoomService.getSocketId(player.id);
      if (socketId) playerSockets.push({playerId: player.id, socketId: socketId });
      else throw new Error('broadcastGameStateOnDistributeCards > socketId not found!');
    }
    return playerSockets;
  }

  private static _getHostPosition(room: IRoom, mappedGame: IMappedGame): PLAYER_POSITION {
    if(mappedGame.mappedPlayers.left?.id == room.createdBy.id) return PLAYER_POSITION.left;
    else if(mappedGame.mappedPlayers.top?.id == room.createdBy.id) return PLAYER_POSITION.top;
    else if(mappedGame.mappedPlayers.right?.id == room.createdBy.id) return PLAYER_POSITION.right;
    return PLAYER_POSITION.bottom;
  }

}