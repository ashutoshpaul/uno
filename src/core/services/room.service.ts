import { Uuid } from "../helpers/uuid.helper";
import { IGame } from "../interfaces/game.interface";
import { IMinifiedRoom } from "../interfaces/minified.interface";
import { IPlayer } from "../interfaces/player.interface";
import { IRoom } from "../interfaces/room.interface";

export class RoomService {

  public static createRoom(playerName: string, roomName: string): {player: IPlayer, room: IRoom} {
    // the client who creates the room is considered as Player #1; rest players are pushed
    const player: IPlayer = RoomService._createPlayer(playerName);

    const room: IRoom = {
      createdBy: {
        id: player.id,
        name: player.name,
      },
      id: Uuid.generateUuid(),
      name: roomName,
      game: <IGame>{
        chats: [],
        discardPileCards: [],
        drawerDeckCards: [],
        isGameStarted: false,
        players: [player],
        lastDrawnCard: null,
      },
      isVacancy: true,
    }

    return { player, room };
  }

  public static updateRoom(playerName: string, room: IRoom): {player: IPlayer, room: IRoom}{
    const player: IPlayer = RoomService._createPlayer(playerName);

    if(
      room.game?.players && Array.isArray(room.game.players) && room.game.players.length
    ) {
      room.game.players.push(player);
      if (room.game.players.length == 4) room.isVacancy = false;
    }
    return { player, room };
  }

  private static _createPlayer(playerName: string): IPlayer {
    return {
      id: Uuid.generateUuid(),
      cards: [],
      isActive: false,
      name: playerName,
      score: 0,
      isCardsLeft: false,
    };
  }

}