import { Uuid } from "../helpers/uuid.helper";
import { IMinifiedIdentity } from "../interfaces/minified.interface";
import { IPlayer } from "../interfaces/player.interface";
import { IRoom } from "../interfaces/room.interface";

export class PlayerService {

  public static createIdentity(player: IPlayer, room: IRoom): IMinifiedIdentity {
    return {
      player: {
      id: player.id,
      name: player.name,
      },
      room: {
      id: room.id,
      name: room.name,
      createdBy: room.createdBy,
      isAvailable: room.isAvailable,
      },
    };
  }

  public static createPlayer(playerName: string): IPlayer {
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