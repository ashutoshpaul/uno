import { Request, Response } from "express";
import { Socket } from "socket.io";
import { RoomService } from "./../../services/room.service";
import { socketIO } from "./../../../app";
import { IUpdateSocketIdPayload } from "./../../interfaces/http.interface";
import { IMinifiedIdentity } from "./../../interfaces/minified.interface";
const Redis = require("ioredis");

const redis = new Redis();

export class PlayerController {

  /**
     * This API is called when the client (website) makes a new connection (on page refresh)
     * but it already has a player and a room.
     * 
     * We will update the socket.id (key) in REDIS (identity) and reassign the player identity
     * to the client.
     * 
     * 1. Get all connections from REDIS (identity).
     * 2. Find which socket.io (key) has playerId-and-roomId (value).
     * 3. Extract value and delete the entry.
     * 4. Add new entry with current socket.io (key) and fetched value.
     * 5. Join new connection to the existing respective game-room.
     */
  static async updateSocketId(req: Request, res: Response) {
    const data: IUpdateSocketIdPayload = req.body;
    const rawData: any = await redis.hgetall('identities');
    const list: Array<any> = [];
    for(let key in rawData) { 
      if(rawData.hasOwnProperty(key)) { 
        list.push({ key: key, value: JSON.parse(rawData[key]) }); 
      } 
    }

    if (list.length > 0) {
      const mappedList: {key: string, value: IMinifiedIdentity}[] = list;

      let identity: IMinifiedIdentity | undefined;
      let key: string | undefined;
      mappedList.filter((e) => {
        if(e.value.player.id == data.identity.player.id
          && e.value.room.id == data.identity.room.id) {
          key = e.key; 
          identity = e.value;
        } else {
          return e;
        }
      });

      if(identity && key) {
        await redis.hdel('identities', key);
        await redis.hset('identities', data.socketId, JSON.stringify(identity));
      }

      const clientSocket = socketIO.sockets.sockets.get(data.socketId);
      if (clientSocket) {
        RoomService.joinSocketToRoom(clientSocket as Socket, data.identity.room.id);
        console.log("socket joined room :)");
      }
    }
    return res.json({}); // triggers subscribed events in front-end. DON'T REMOVE.
  }

}