import { Request, Response } from "express";
import { Socket } from "socket.io";
import { socketIO } from "./../../../app";
import { ICreateRoomPayload, IJoinRoomPayload } from "src/core/interfaces/http.interface";
import { IMinifiedIdentity } from "src/core/interfaces/minified.interface";
import { IRoom } from "src/core/interfaces/room.interface";
import { RoomService } from "./../../services/room.service";
import { PlayerService } from "./../../services/player.service";

const Redis = require("ioredis");

const redis = new Redis();

export class RoomController {

  static async getRooms(req: Request, res: any) {
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