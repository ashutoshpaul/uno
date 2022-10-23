import { Socket } from "socket.io";
import { IPlayer } from "src/core/interfaces/player.interface";
import { IMinifiedIdentity, IMinifiedRoom } from "../../interfaces/minified.interface";
import { IRoom } from "../../interfaces/room.interface";
import { RoomService } from "../../services/room.service";
const Redis = require("ioredis");

const redis = new Redis();

export class RoomHandler {

  static async createRoom(socket: Socket, playerName: string, roomName: string): Promise<IMinifiedIdentity | null> {
    try {
      const { player, room } = RoomService.createRoom(playerName, roomName);
      const identity: IMinifiedIdentity = RoomHandler.createIdentity(player, room);

      await redis.hset("identities", socket.id, JSON.stringify(identity));
      await redis.hset("rooms", room.id, JSON.stringify(room));

      socket.join(room.id);
      return identity;
    } catch (err) {
      console.error('createRoom', err);
    }
    return null;
  }

  static async joinRoom(socket: Socket, playerName: string, minifiedRoom: IMinifiedRoom): Promise<IMinifiedIdentity | null> {
    try {
      let fetchRoom: IRoom = JSON.parse(await redis.hget("rooms", minifiedRoom.id));
      if(fetchRoom) {
        const { player, room } = RoomService.updateRoom(playerName, fetchRoom);
        const identity: IMinifiedIdentity = RoomHandler.createIdentity(player, room);
        
        await redis.hset("identities", socket.id, JSON.stringify(identity));
        await redis.hset("rooms", room.id, JSON.stringify(room)); // update

        socket.join(room.id);
        return identity;
      }
    } catch (err) {
      console.error('createRoom', err);
    }
    return null;
  }

  static createIdentity(player: IPlayer, room: IRoom): IMinifiedIdentity {
    return {
      player: {
        id: player.id,
        name: player.name,
      },
      room: {
        id: room.id,
        name: room.name,
        createdBy: room.createdBy,
        isVacancy: room.isVacancy,
      },
    };
  }
}