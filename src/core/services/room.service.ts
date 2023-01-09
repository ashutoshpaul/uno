import { Socket } from "socket.io";
import { Uuid } from "../helpers/uuid.helper";
import { IGame } from "../interfaces/game.interface";
import { IMinifiedIdentity } from "../interfaces/minified.interface";
import { IPlayer } from "../interfaces/player.interface";
import { IRoom } from "../interfaces/room.interface";
import { PlayerService } from "./player.service";
import { socketIO } from "./../../app";
const Redis = require("ioredis");

const redis = new Redis();

export class RoomService {

  public static createRoom(playerName: string, roomName: string): {player: IPlayer, room: IRoom} {
    // the client who creates the room is considered as Player #1; rest players are pushed.
    const player: IPlayer = PlayerService.createPlayer(playerName);

    const room: IRoom = {
      createdBy: {
        id: player.id,
        name: player.name,
        status: player.status,
      },
      id: Uuid.generateUuid(),
      name: roomName,
      game: <IGame>{
        chats: [],
        discardPileCards: [],
        drawerDeckCards: [],
        isGameStarted: false,
        players: [player],
      },
      isAvailable: true,
    }

    return { player, room };
  }

  public static updateRoom(playerName: string, room: IRoom): { player: IPlayer, room: IRoom } {
    const player: IPlayer = PlayerService.createPlayer(playerName);

    if(room.game?.players && Array.isArray(room.game.players) && room.game.players.length) {
      room.game.players.push(player);
      if (room.game.players.length == 4 || room.game.isGameStarted) { 
        room.isAvailable = false; 
      } else if (room.game.players.length < 4 && !room.game.isGameStarted) { 
        room.isAvailable = true; 
      }
    }
    return { player, room };
  }

  public static updateRoomAvailability(room: IRoom): void {
    if (room.game.players?.length && room.game.players.length == 4 || room.game.isGameStarted) { 
      room.isAvailable = false; 
    } else if (room.game.players.length < 4 && !room.game.isGameStarted) { 
      room.isAvailable = true; 
    }
  }

  public static async getSocketId(playerId: string): Promise<string | null> {
    const rawData: any = await redis.hgetall('identities');
    const list: Array<any> = [];
    for(let key in rawData) { 
      if(rawData.hasOwnProperty(key)) { 
        list.push({ key: key, value: JSON.parse(rawData[key]) }); 
      }
    }
    const mappedPlayers: {key: string, value: IMinifiedIdentity}[] = list;

    const player: {key: string, value: IMinifiedIdentity} | undefined = 
      mappedPlayers.find((e) => playerId == e.value.player.id);
    
    return player ? player.key : null;
  }

  public static async getSocketIds(playerIds: string[]): Promise<string[]> {
    const rawData: any = await redis.hgetall('identities');
    const list: Array<any> = [];
    for(let key in rawData) { 
      if(rawData.hasOwnProperty(key)) { 
        list.push({ key: key, value: JSON.parse(rawData[key]) }); 
      }
    }
    const mappedPlayers: {key: string, value: IMinifiedIdentity}[] = list;

    const players: {key: string, value: IMinifiedIdentity}[] | undefined = 
      mappedPlayers.filter((e) => playerIds.includes(e.value.player.id));
    
    return players ? players.map(e => e.key) : [];
  }

  public static joinSocketToRoom(socket: Socket, roomId: string): void {
    socket.join(roomId);
  }

  public static removeSocketFromRoom(socket: Socket, roomId: string): void {
    socket.leave(roomId);
  }

  /**
   * Removes all sockets from a particular room.
   * * Removes socketIds from REDIS ('idenetities') and unregisters them from listner (i.e., room).
   * * Usecase: Remove sockets from REDIS ('identities') + unregister-sockets on room-delete event.
   * 
   * @param players All players of the room (including the one who invoked this function).
   */
  public static async removeAllSocketsFromRoom(roomId: string, players: IPlayer[]): Promise<void> {
    const playerIds: string[] = players.map(e => e.id);

    const rawData: any = await redis.hgetall('identities');
    const list: Array<any> = [];
    for(let key in rawData) { 
      if(rawData.hasOwnProperty(key)) { 
        list.push({ key: key, value: JSON.parse(rawData[key]) }); 
      }
    }
    const mappedPlayers: {key: string, value: IMinifiedIdentity}[] = list;

    const playersToBeDeleted: {key: string, value: IMinifiedIdentity}[] = 
      mappedPlayers.filter((e) => playerIds.includes(e.value.player.id));

    const socketIdsToBeDeleted: string[] = playersToBeDeleted.map(e => e.key);

    await redis.hdel('identities', socketIdsToBeDeleted);

    socketIdsToBeDeleted.forEach(socket => {
      const socketToBeDeleted: Socket | undefined = socketIO.sockets.sockets.get(socket);
      if (socketToBeDeleted) {
        RoomService.removeSocketFromRoom(socketToBeDeleted, roomId);
        console.log('socket (', socket, ') unregistered');
      } else console.log('socket (', socket, ') doesnot exists... <not-an-error>');
    });
  }

}