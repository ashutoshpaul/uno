import { Request, Response } from "express";
import { socketIO } from "./../../../app";
import { IRoom } from "./../../interfaces/room.interface";
import { WebsocketCommunication } from "./../../websocket/communication/websocket.communication";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";

import { IMessage } from "./../../interfaces/message.interface";
import { IPlayer } from "./../../interfaces/player.interface";
const Redis = require("ioredis");

const redis = new Redis();

export class ChatController {

  /**
   * @param req roomId: string
   * @returns IMessage[]
   */
  static async getMessages(req: Request, res: Response) {
    const roomId: string = req.params.roomId;
    if (roomId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
        if (room) {
          const messages: IMessage[] = room.game.chats;
          return res.json(messages);
        } else { throw new Error('Room not found!'); }
      } catch (err) { console.log(err+""); }
    } else { throw new Error('roomId required'); }
  }

  /**
   * Send message to opponents
   * 
   * 1. Fetch room from 'rooms' (REDIS).
   * 2. Check whether player belongs to the room. If yes then Step 3.
   * 3. Add message to room.game.chats array.
   * 4. Update room in 'rooms' (REDIS).
   * 5. Broadcast message to affected players room.
   * 
   * @param req roomId (params), IMessage 
   * @param res IMessage
   */
  static async sendMessage(req: Request, res: Response) {
    const roomId: string = req.params.roomId;
    const socketId: string = req.headers['socket-id']+"";
    try {
      const message: IMessage = req.body;
      if (roomId && socketId && message) {
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));

        if (room) {
          const isPlayerValid: IPlayer | undefined = room.game.players.find(e => e.id == message.author.id);

          if (isPlayerValid) {
            if (!room.game.chats) room.game.chats = [];
            room.game.chats.push(message);

            await redis.hset("rooms", room.id, JSON.stringify(room)); // update

            const clientSocket = socketIO.sockets.sockets.get(socketId);
            if (clientSocket) {
              WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.message, message);
              console.log('\'' + message.content + '\'' + 'message sent');

              res.json(message);
            } else { throw new Error('socketId not found!'); }
          } else { throw new Error('player is not a participant of room.'); }
        } else { throw new Error("room not found!"); }
      } else {
        throw new Error("roomId, socketId and IMessage required.");
      }
    } catch (err) { throw new Error(err+""); }
  }
}