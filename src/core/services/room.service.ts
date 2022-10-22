import { Uuid } from "../helpers/uuid.helper";
import { IGame } from "../interfaces/game.interface";
import { IPlayer } from "../interfaces/player.interface";
import { IRoom } from "../interfaces/room.interface";

export class RoomService {

  public static createRoom(playerName: string, roomName: string): IRoom {
    // the client who creates the room is considered as Player #1
    const player: IPlayer = {
      id: Uuid.generateUuid(),
      cards: [],
      isActive: false,
      name: playerName,
      score: 0,
      isCardsLeft: false,
    };

    const room: IRoom = {
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
    }

    return room;
  }

}