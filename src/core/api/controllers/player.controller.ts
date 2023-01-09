import { Request, Response } from "express";
import { Socket } from "socket.io";
import { RoomService } from "./../../services/room.service";
import { socketIO } from "./../../../app";
import { IConnectionUpdatedResponse, IUpdateSocketIdPayload } from "../../interfaces/response.interface";
import { IMinifiedIdentity, IMinifiedPlayer } from "./../../interfaces/minified.interface";
import { STATUS } from "./../../enums/status.enum";
import { IRoom } from "./../../interfaces/room.interface";
import { WebsocketCommunication } from "./../../websocket/communication/websocket.communication";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";
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
     * 4. Set "status = 'online'" in REDIS ('identities'|'rooms').
     * 5. If player is Host then set createdBy.status = 'online' in REDIS ('rooms').
     * 6. Remove disconnectedAt from REDIS ('identities').
     * 7. Add new entry with current socket.io (key) and fetched value.
     * 8. Join new connection to the existing respective game-room.
     * 9. Check 'disconnectedAt'. If greater than 5 seconds then emit 
     *    'player-back-online' event to affected room players.
     * 
     * ### Which status will get updated?
     * 1. Update identity.player.status = 'online' in REDIS ('identities').
     * 2. If player is Host then update identity.room.createdBy.status = 'online' in REDIS ('identities').
     * 3. Update room.game.players[index].status = 'online' in REDIS ('rooms').
     * 4. If player is Host then update room.createdBy.status = 'online' in REDIS ('rooms').
     * 
     * Check RoomHandler.playerDisconnected() documentation for details.
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

        identity.player.status = STATUS.online;

        if (identity.room.createdBy?.id == identity.player.id) {
          identity.room.createdBy.status = STATUS.online;
        }

        const room: IRoom = JSON.parse(await redis.hget('rooms', identity.room.id));

        if (room) {
          const playerIndex: number = room.game.players.findIndex(e => identity?.player.id == e.id);
          if (playerIndex != -1) {
            room.game.players[playerIndex].status = STATUS.online;

            if (room.createdBy.id == identity.player.id) {
              room.createdBy.status = STATUS.online;
            }

            const disconnectedAt: Date | undefined = identity.player.disconnectedAt
             ? new Date(identity.player.disconnectedAt)
             : undefined;

            delete identity.player.disconnectedAt;
            await redis.hset('identities', data.socketId, JSON.stringify(identity));
            await redis.hset('rooms', room.id, JSON.stringify(room));  // update

            const clientSocket = socketIO.sockets.sockets.get(data.socketId);
            if (clientSocket) {
              RoomService.joinSocketToRoom(clientSocket as Socket, data.identity.room.id);
              console.log("socket reconnected :)");

              if (disconnectedAt) {
                const now: Date = new Date();
                if (now.getTime() - disconnectedAt.getTime() > 5 * 1000) {
                  const response: IConnectionUpdatedResponse = {
                    players: room.game.players.map(player => <IMinifiedPlayer>{
                      id: player.id,
                      name: player.name,
                      status: player.status,
                    }),
                  };
                  WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.connectionToggled, response);
                }
              }
            }
          } else throw new Error('player not found in players[]');
        } else throw new Error('room not found');
      }
    }
    return res.json({}); // triggers subscribed events in front-end. DON'T REMOVE.
  }

}