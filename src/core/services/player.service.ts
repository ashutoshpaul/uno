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
      isCardLeft: false,
    };
  }

  public static setPlayerActive(room: IRoom, identity: IMinifiedIdentity, isActive: boolean = true): IRoom {
    const player: IPlayer | undefined = room.game.players.find(e => identity.player.id == e.id);
    const index: number = room.game.players.findIndex(e => identity.player.id == e.id);
    if (player && index != -1) {
      player.isActive = isActive;
      room.game.players[index] = player;
    } else { throw new Error('Player not found'); }
    
    return room;
  }

}