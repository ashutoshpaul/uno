import { Request, Response } from "express";
import { Socket } from "socket.io";
import { socketIO } from "./../../../app";
import { ICreateRoomPayload, IJoinRoomPayload, IJoinRoomResponse, ILobbyRoomResponse } from "src/core/interfaces/http.interface";
import { IMinifiedIdentity, IMinifiedPlayer } from "src/core/interfaces/minified.interface";
import { IRoom } from "src/core/interfaces/room.interface";
import { RoomService } from "./../../services/room.service";
import { PlayerService } from "./../../services/player.service";
import { WebsocketCommunication } from "./../../websocket/communication/websocket.communication";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";
import { IPlayer } from "src/core/interfaces/player.interface";

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

            const response: IJoinRoomResponse = {
              identity: identity,
              room: {
                createdBy: room.createdBy,
                id: room.id,
                isGameStarted: room.game.isGameStarted,
                name: room.name,
                players: room.game.players,
              }
            };

            RoomService.joinSocketToRoom(clientSocket, room.id);
            WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.roomJoined, response.room);
            
            return res.json(response);
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

  /**
   * Delete a room (only host is allowed to delete his/her created room).
   * 1. Check whether client is host or not. If host then Step 2.
   * 2. Delete room from the REDIS database (rooms)
   * 3. Fetch all players from the REDIS database (identities)
   * 4. Delete all players connected to the room in 'identities' (delete keys via socketId)
   * 5. Broadcast 'room-deleted' event to affected room players
   * 6. In front-end, delete identity of affected room players
   */
  static async deleteRoom(req: Request, res: Response) {
    const roomId: string = req.params.id;
    const socketId: string = req.headers['socket-id']+"";
    try {
      if (roomId && socketId) {
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
        
        if (room) {
          const createdBy: IMinifiedPlayer = room.createdBy;

          const playerInitiatedDeletion: IMinifiedIdentity = 
            JSON.parse(await redis.hget('identities', socketId));

          if (playerInitiatedDeletion && 
            playerInitiatedDeletion.player.id == createdBy.id) {

            const players: IPlayer[] = room.game.players;
            const playerIds: string[] = players.map(e => e.id);

            await redis.hdel('rooms', roomId);

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

            const socketIds: string[] = playersToBeDeleted.map(e => e.key);
            console.log(playersToBeDeleted, socketIds);

            await redis.hdel('identities', socketIds);
            console.log("socket-ids deleted");

            const clientSocket = socketIO.sockets.sockets.get(socketId);
            if(clientSocket) {
              WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.roomDeleted, null);
              res.json({});
            }
          } else { throw new Error('player is not host'); }
        } else {
          throw new Error("room not found");
        }
      } else {
        throw new Error("roomId and socketId required.");
      }
    } catch (err) { throw new Error(err+""); }
  }

  /**
   * Player leaves room (host cannot leave room. Host can delete the room.)
   * 1. Check whether client is host or not. If client is not host then Step 2.
   * 2. Remove player from players-list of his/her room (REDIS 'rooms').
   * 3. Remove player's identity from REDIS database 'identities'.
   * 4. Broadcast 'room-left' event to affected room players.
   */
  static async leaveRoom(req: Request, res: Response) {
    const roomId: string = req.params.id;
    const socketId: string = req.headers['socket-id']+"";
    try {
      if (roomId && socketId) {
        const room: IRoom = JSON.parse(await redis.hget('rooms', roomId));
        
        if (room) {
          const createdBy: IMinifiedPlayer = room.createdBy;

          const playerLeavingRoom: IMinifiedIdentity = 
            JSON.parse(await redis.hget('identities', socketId));

          if (playerLeavingRoom && 
            playerLeavingRoom.player.id != createdBy.id) {

              const filteredPlayers: IPlayer[] = 
                room.game.players.filter(e => e.id != playerLeavingRoom.player.id);

              room.game.players = filteredPlayers;

              await redis.hset("rooms", room.id, JSON.stringify(room)); // update
              await redis.hdel('identities', socketId);
              
              const clientSocket = socketIO.sockets.sockets.get(socketId);
              if(clientSocket) {
                const typedRoom: ILobbyRoomResponse = {
                  createdBy: room.createdBy,
                  id: room.id,
                  isGameStarted: room.game.isGameStarted,
                  players: room.game.players.map(player => <IMinifiedPlayer>{
                    id: player.id,
                    name: player.name,
                  }),
                  name: room.name,
                }
                console.log('room left');
                WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.roomLeft, typedRoom);
                res.json({});
              }
          } else { throw new Error('player is host'); }
        }
      } else {
        throw new Error("roomId and socketId required.");
      }
    } catch (err) { throw new Error(err+""); }
  }

}