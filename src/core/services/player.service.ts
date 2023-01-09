import { STATUS } from "../enums/status.enum";
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
        status: player.status,
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
      status: STATUS.online,
      isCardLeft: false,
    };
  }

  public static setPlayerActive(room: IRoom, identity: IMinifiedIdentity, isActive: boolean = true): IRoom {
    const index: number = room.game.players.findIndex(e => identity.player.id == e.id);
    
    if (index != -1) room.game.players[index].isActive = isActive;
    else throw new Error('Player not found');
    
    return room;
  }

}