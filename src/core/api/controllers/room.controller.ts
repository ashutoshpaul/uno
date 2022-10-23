import { Request, Response } from "express";
import { Socket } from "socket.io";
import { socketIO } from "./../../../app";
import { ICreateRoomPayload, IJoinRoomPayload, ILobbyRoomResponse } from "src/core/interfaces/http.interface";
import { IMinifiedIdentity, IMinifiedPlayer } from "src/core/interfaces/minified.interface";
import { IRoom } from "src/core/interfaces/room.interface";
import { RoomService } from "./../../services/room.service";
import { PlayerService } from "./../../services/player.service";
import { WebsocketCommunication } from "./../../websocket/communication/websocket.communication";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";

const Redis = require("ioredis");

const redis = new Redis();

export class RoomController {

  static async getRoom(req: Request, res: Response) {
    const roomId: string = req.params.id;
    try {
      const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
      if (room) {
        const response: ILobbyRoomResponse = {
          createdBy: room.createdBy,
          id: room.id,
          isGameStarted: room.game.isGameStarted,
          players: room.game.players.map(player => <IMinifiedPlayer>{
            id: player.id,
            name: player.name,
          }),
          name: room.name,
        }
        res.json(response);
      } else { throw new Error("Room not found"); }
    } catch (err) { console.log(err); }
  }

  static async getRooms(req: Request, res: Response) {
    const rawData: any = await redis.hgetall('rooms');
    const list: Array<any> = [];
    for(let key in rawData) { 
      if(rawData.hasOwnProperty(key)) { 
        list.push(JSON.parse(rawData[key])); 
      } 
    }
    const mappedList: {key: string, value: IRoom}[] = list;
    res.json(mappedList);
  }

  static async createRoom(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    try {
      const data: ICreateRoomPayload = req.body;
      if (data && socketId) {
        const { player, room } = RoomService.createRoom(data.playerName, data.roomName);
        const identity: IMinifiedIdentity = PlayerService.createIdentity(player, room);

        const clientSocket = socketIO.sockets.sockets.get(socketId);
        if (clientSocket) {
          await redis.hset("identities", (clientSocket as Socket).id, JSON.stringify(identity));
          await redis.hset("rooms", room.id, JSON.stringify(room));
    
          RoomService.joinSocketToRoom(clientSocket as Socket, room.id);
          return res.json(identity);
        }
        throw new Error("socket is missing");
      } else {
        throw new Error("data and socket-id is required");
      }
    } catch (err) {
      console.error('createRoom', err);
    }
    return res.json(null);
  }

  static async joinRoom(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    try {
      const data: IJoinRoomPayload = req.body;
      if (data && socketId) {
        let fetchRoom: IRoom = JSON.parse(await redis.hget("rooms", data.room.id));
        if(fetchRoom && fetchRoom.isAvailable) {
          const { player, room } = RoomService.updateRoom(data.playerName, fetchRoom);
          const identity: IMinifiedIdentity = PlayerService.createIdentity(player, room);

          const clientSocket = socketIO.sockets.sockets.get(socketId);
          if (clientSocket) {
            await redis.hset("identities", clientSocket.id, JSON.stringify(identity));
            await redis.hset("rooms", room.id, JSON.stringify(room)); // update

            RoomService.joinSocketToRoom(clientSocket, room.id);
            WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.roomJoined, room);
            return res.json(identity);
          }
          throw new Error("socket is missing");
        } else {
          throw new Error("room is not available");
        }
      } else {
        throw new Error("data and socket-id is required");
      }
    } catch (err) {
      console.error('joinRoom', err);
    }
    return res.json(null);
  }

}