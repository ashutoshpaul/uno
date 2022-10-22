import { IMinifiedIdentity } from "../interfaces/minified.interface";
import { IRoom } from "../interfaces/room.interface";
import { RoomService } from "../services/room.service";

export class RoomController {
  
  static createRoom(socket: any, playerName: string, roomName: string): IMinifiedIdentity | null {
    try {
      const room: IRoom = RoomService.createRoom(playerName, roomName);
      console.log(room);
  
      // join room
      socket.join(room.id);

      // store room in redis

      return <IMinifiedIdentity>{
        player: {  // 1st player
          id: room.game.players[0].id,
          name: room.game.players[0].name,
        },
        room: {
          id: room.id,
          name: room.name,
        },
      };
    } catch (err) {
      console.error('createRoom', err);
    }
    return null;
  }
}