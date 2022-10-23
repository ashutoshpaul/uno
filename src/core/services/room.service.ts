import { Socket } from "socket.io";
import { Uuid } from "../helpers/uuid.helper";
import { IGame } from "../interfaces/game.interface";
import { IPlayer } from "../interfaces/player.interface";
import { IRoom } from "../interfaces/room.interface";
import { PlayerService } from "./player.service";

export class RoomService {

  public static createRoom(playerName: string, roomName: string): {player: IPlayer, room: IRoom} {
    // the client who creates the room is considered as Player #1; rest players are pushed
    const player: IPlayer = PlayerService.createPlayer(playerName);

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
      isAvailable: true,
    }

    return { player, room };
  }

  public static updateRoom(playerName: string, room: IRoom): {player: IPlayer, room: IRoom}{
    const player: IPlayer = PlayerService.createPlayer(playerName);

    if(
      room.game?.players && Array.isArray(room.game.players) && room.game.players.length
    ) {
      room.game.players.push(player);
      if (room.game.players.length == 4 || room.game.isGameStarted) { 
        room.isAvailable = false; 
      } else if (room.game.players.length < 4 && !room.game.isGameStarted) { 
        room.isAvailable = true; 
      }
    }
    return { player, room };
  }

  public static joinSocketToRoom(socket: Socket, roomId: string): void {
    socket.join(roomId);
  }

}