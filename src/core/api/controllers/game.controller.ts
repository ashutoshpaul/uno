import { Request, Response } from "express";
import { socketIO } from "./../../../app";
import { IMinifiedIdentity, IMinifiedPlayer } from "./../../interfaces/minified.interface";
import { IRoom } from "./../../interfaces/room.interface";
import { GameService } from "./../../services/game.service";
import { WebsocketCommunication } from "./../../websocket/communication/websocket.communication";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";
import { IDistributeCardsResponse, IJoinedPlayersResponse, ILobbyRoomResponse } from "./../../interfaces/response.interface";
import { PlayerService } from "./../../services/player.service";
import { IMappedGame } from "./../../interfaces/game.interface";
import { GameMapService } from "./../../services/game-map.service";
import { GAME_EVENTS } from "./../../enums/game-events.enum";
const Redis = require("ioredis");

const redis = new Redis();

export class GameController {

  /**
   * Player has started a new game.
   * 1. Check whether at least two players are present in the room. If yes then Step 2.
   * 2. Create a new game (IGame).
   * 3. Update player 'isActive' = true.
   * 4. Update room in 'rooms' (REDIS).
   * 5. Broadcast game has started to affected room players.
   * 6. Return updated ILobbyRoomResponse object.
   * 
   * @param req: IMinifiedIdentity
   * @param res: ILobbyRoomResponse
   */
  static async startGame(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    const data: IMinifiedIdentity = req.body;
  
    if (data && socketId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', data.room.id));
        if (room) {
          if (room.game.players.length > 1) {
            let updatedRoom: IRoom = GameService.newGame(room);

            updatedRoom = PlayerService.setPlayerActive(updatedRoom, data);
  
            await redis.hset("rooms", room.id, JSON.stringify(updatedRoom)); // update
  
            const clientSocket = socketIO.sockets.sockets.get(socketId);
            if (clientSocket) {
              const response: ILobbyRoomResponse = {
                createdBy: updatedRoom.createdBy,
                id: updatedRoom.id,
                isGameStarted: updatedRoom.game.isGameStarted,
                players: updatedRoom.game.players.map(player => <IMinifiedPlayer>{
                  id: player.id,
                  name: player.name,
                }),
                name: updatedRoom.name,
              };

              WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.gameStarted, response);

              return res.json(response);
            } else { throw new Error("socket is missing"); }
          } else { throw new Error('Minimum 2 players required!'); }
        } else { throw new Error('Room not found!'); }
      } catch (err) { console.log(err+""); }
    } else { throw new Error('IMinifiedIdentity and socketId required'); }
  }

  /**
   * Player has started a new game.
   * 1. Check whether game started or not. If game started then Step 2.
   * 2. Update player 'isActive' = true.
   * 3. Update room in 'rooms' (REDIS).
   * 4. Broadcast game-joined to affected room players.
   * 5. Return updated IJoinedPlayersResponse object.
   * 
   * @param req: IMinifiedIdentity
   * @param res: IJoinedPlayersResponse
   */
  static async joinGame(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    const data: IMinifiedIdentity = req.body;

    if (data && socketId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', data.room.id));
        if (room) {
          if (room.game.isGameStarted) {

            const updatedRoom = PlayerService.setPlayerActive(room, data);
  
            await redis.hset("rooms", room.id, JSON.stringify(updatedRoom)); // update
  
            const clientSocket = socketIO.sockets.sockets.get(socketId);
            if (clientSocket) {
              const joinedPlayersCount: number = updatedRoom.game.players.filter(e => e.isActive).length || 0;

              const response: IJoinedPlayersResponse = {
                joinedPlayersCount: joinedPlayersCount,
                totalPlayersCount: updatedRoom.game.players.length,
              };

              WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.gameJoined, response);

              return res.json(response);
            } else { throw new Error("socket is missing"); }
          } else { throw new Error('Game not yet started!'); }
        } else { throw new Error('Room not found!'); }
      } catch (err) { console.log(err+""); }
    } else { throw new Error('IMinifiedIdentity and socketId required'); }
  }

  /**
   * Returns number of players joined game (not room)
   * 
   * 1. Fetch room from 'rooms' (REDIS)
   * 2. Count Player's 'isActive' = true.
   * 3. Return response.
   * 
   * @param req roomId
   * @param res IJoinedPlayersResponse
   */
  static async joinedPlayersCount(req: Request, res: Response) {
    const roomId: string = req.params.roomId;
    if (roomId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
        if (room) {
          const joinedPlayersCount: number = room.game.players.filter(e => e.isActive).length || 0;

          const response: IJoinedPlayersResponse = {
            joinedPlayersCount: joinedPlayersCount,
            totalPlayersCount: room.game.players.length,
          };

          return res.json(response);
        } else { throw new Error('room not found!'); }
      } catch (err) { console.log(err+""); }
    } else { throw new Error('roomId is required!'); } 
  }

  /**
   * * Once all the players have joined game. Then Host (from front-end) sends request to shuffle
   * * Note: Cards are first shuffled (emit websocket-event) then distributed.
   * 
   * 1. Check if player is Host. If yes then Step 2.
   * 2. Check if game has started and all players have joined. If yes then Step 3.
   * 3. Check if cards are already distributed. If yes then then jump to Step 9.
   * 4. Distribute cards.
   * 5. Update IPlayer.isCardLeft = true for all players.
   * 6. Update room in 'rooms' (REDIS).
   * 7. Broadcast 'distribute' event to affected room players one by one with IMappedGame.
   * 8. Return IDistributeCardsResponse to the Host.
   * 
   * @param req IMinifiedIdentity
   * @param res IDistributeCardsResponse
   */
  static async distributeCards(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    const identity: IMinifiedIdentity = req.body;
    if (identity) {
      try {
        const roomId: string = identity.room.id;
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
        if (room) {
          const isHost: boolean = room.createdBy.id == identity.player.id;
          const hasGameStarted: boolean = room.game.isGameStarted;
          const hasAllPlayersJoined: boolean = room.game.players.every(e => e.isActive);

          if (isHost && hasGameStarted && hasAllPlayersJoined) {
            // if a player has atleast 1 card that means the cards were distributed.
            const isCardsAlreadyDistributed: boolean = !!room.game.players[0].cards.length;

            if (!isCardsAlreadyDistributed) {
              console.log('distributing cards...');
              room.game = GameService.distributeCards(room.game);
              room.game.players.map(e => e.isCardLeft = true);
              await redis.hset("rooms", room.id, JSON.stringify(room)); // update

              const clientSocket = socketIO.sockets.sockets.get(socketId);
              if (clientSocket) {
                GameMapService.broadcastGameStateOnDistributeCards(room);
                return res.json(<IDistributeCardsResponse>{ isCardsShuffledEventEmitted: true });
              } else throw new Error("socket is missing");
            } else {
              console.log('cards already distributed (not an error).');
              return res.json(<IDistributeCardsResponse>{ isCardsShuffledEventEmitted: false });
            }

          } else throw new Error('player is not host and/or game has not yet started and/or all players have not joined yet!');
        } else throw new Error('room not found!');
      } catch (err) { console.log(err+""); }
    } else { throw new Error('IMinifiedIdentity required!') };
  }

  /**
   * * Get current game state.
   * * Used to get the current game state on page refresh.
   * 
   * 1. Fetch room from REDIS ('rooms').
   * 2. Check player belongs to the room or not. If yes then Step 3.
   * 3. Generate IMappedGame and return result.
   * 
   * @param req params (roomId and playerId)
   * @param res IMappedGame
   */
  public static async getGameState(req:  Request, res: Response) {
    const roomId: string = req.params.roomId;
    const playerId: string = req.params.playerId;

    if (roomId && playerId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
        if (room) {
          const isPlayerBelongsToRoom: boolean = !!room.game.players.find(e => e.id == playerId);
          if (isPlayerBelongsToRoom) {
            const mappedGame: IMappedGame = GameMapService.getGameState(playerId, room);
            return res.json(mappedGame);
          } else throw new Error('player does not belongs to room');
        } else throw new Error('room not found');
      } catch (err) { console.log(err+''); }
    } else throw new Error('roomId and playerId are required!');
  }

}