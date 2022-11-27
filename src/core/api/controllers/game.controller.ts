import { Request, Response } from "express";
import { socketIO } from "./../../../app";
import { IMinifiedIdentity, IMinifiedPlayer } from "./../../interfaces/minified.interface";
import { IRoom } from "./../../interfaces/room.interface";
import { GameService } from "./../../services/game.service";
import { WebsocketCommunication } from "./../../websocket/communication/websocket.communication";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";
import { ILobbyRoomResponse } from "./../../interfaces/response.interface";
import { PlayerService } from "./../../services/player.service";
const Redis = require("ioredis");

const redis = new Redis();

export class GameController {

  /**
   * Player has started a new game.
   * 1. Check whether at least two players are present in the room. If yes then Step 2.
   * 2. Create a new game (IGame).
   * 3. Update player 'isActive' = true.
   * 4. Update room in 'rooms' (REDIS).
   * 5. Broadcast game has started to affected room players.
   * 6. Return updated ILobbyRoomResponse object.
   * 
   * @param req: IMinifiedIdentity
   * @param res: ILobbyRoomResponse
   */
  static async startGame(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    const data: IMinifiedIdentity = req.body;
  
    if (data && socketId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', data.room.id));
        if (room) {
          if (room.game.players.length > 1) {
            let updatedRoom: IRoom = GameService.newGame(room);

            updatedRoom = PlayerService.setPlayerActive(updatedRoom, data);
  
            await redis.hset("rooms", room.id, JSON.stringify(updatedRoom)); // update
  
            const clientSocket = socketIO.sockets.sockets.get(socketId);
            if (clientSocket) {
              const response: ILobbyRoomResponse = {
                createdBy: updatedRoom.createdBy,
                id: updatedRoom.id,
                isGameStarted: updatedRoom.game.isGameStarted,
                players: updatedRoom.game.players.map(player => <IMinifiedPlayer>{
                  id: player.id,
                  name: player.name,
                }),
                name: updatedRoom.name,
              };

              WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.gameStarted, response);

              return res.json(response);
            } else { throw new Error("socket is missing"); }
          } else { throw new Error('Minimum 2 players required!'); }
        } else { throw new Error('Room not found!'); }
      } catch (err) { console.log(err+""); }
    } else { throw new Error('IMinifiedIdentity and socketId required'); }
  }

  /**
   * Player has started a new game.
   * 1. Check whether game started or not. If game started then Step 2.
   * 2. Update player 'isActive' = true.
   * 3. Update room in 'rooms' (REDIS).
   * 4. Broadcast game-joined to affected room players.
   * 5. Return updated ILobbyRoomResponse object.
   * 
   * @param req: IMinifiedIdentity
   * @param res: ILobbyRoomResponse
   */
  static async joinGame(req: Request, res: Response) {
    const socketId: string = req.headers['socket-id']+"";
    const data: IMinifiedIdentity = req.body;

    if (data && socketId) {
      try {
        const room: IRoom = JSON.parse(await redis.hget('rooms', data.room.id));
        if (room) {
          if (room.game.isGameStarted) {

            const updatedRoom = PlayerService.setPlayerActive(room, data);
  
            await redis.hset("rooms", room.id, JSON.stringify(updatedRoom)); // update
  
            const clientSocket = socketIO.sockets.sockets.get(socketId);
            if (clientSocket) {
              const response: ILobbyRoomResponse = {
                createdBy: updatedRoom.createdBy,
                id: updatedRoom.id,
                isGameStarted: updatedRoom.game.isGameStarted,
                players: updatedRoom.game.players.map(player => <IMinifiedPlayer>{
                  id: player.id,
                  name: player.name,
                }),
                name: updatedRoom.name,
              };

              WebsocketCommunication.emit(clientSocket, room.id, RESPONSE_EVENTS.gameJoined, response);

              return res.json(response);
            } else { throw new Error("socket is missing"); }
          } else { throw new Error('Game not yet started!'); }
        } else { throw new Error('Room not found!'); }
      } catch (err) { console.log(err+""); }
    } else { throw new Error('IMinifiedIdentity and socketId required'); }
  }

}