import { Socket } from "socket.io";
import { IMinifiedIdentity } from "../../interfaces/minified.interface";
import { IRoom } from "../../interfaces/room.interface";
import { RoomService } from "../../services/room.service";
const Redis = require("ioredis");

const redis = new Redis();

export class RoomHandler {

  static async createRoom(socket: Socket, playerName: string, roomName: string): Promise<IMinifiedIdentity | null> {
    try {
      const room: IRoom = RoomService.createRoom(playerName, roomName);
      
      const identity: IMinifiedIdentity = {
        player: {  // 1st player
          id: room.game.players[0].id,
          name: room.game.players[0].name,
        },
        room: {
          id: room.id,
          name: room.name,
          createdBy: {
            id: room.game.players[0].id,
            name: room.game.players[0].name,
          }
        },
      };

      // store player details in identity
      await redis.hset("identities", socket.id, JSON.stringify(identity));

      // store room in redis
      await redis.hset("rooms", room.id, JSON.stringify(room));

      // join room
      socket.join(room.id);

      return identity;
    } catch (err) {
      console.error('createRoom', err);
    }
    return null;
  }
}