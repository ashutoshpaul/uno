import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { GameController } from "../controllers/game.controller";
import { PlayerController } from "../controllers/player.controller";
import { RoomController } from "../controllers/room.controller";

export class MainRoute {

  public register(app: express.Application): void {
    app.route("/identity").post(PlayerController.updateSocketId);

    app.route("/rooms/:id").get(RoomController.getRoom);
    app.route("/rooms").get(RoomController.getRooms);
    app.route("/rooms").post(RoomController.createRoom);
    app.route("/join-room").post(RoomController.joinRoom);
    app.route("/rooms/:id").delete(RoomController.deleteRoom);
    app.route("/room/leave/:id").get(RoomController.leaveRoom);
    app.route("/room/remove/:id").post(RoomController.removePlayer);

    app.route("/game/start").post(GameController.startGame);
    app.route("/game/join").post(GameController.joinGame);
    app.route("/game/joined-players-count/:roomId").get(GameController.joinedPlayersCount);

    app.route("/messages/:roomId").get(ChatController.getMessages);
    app.route("/messages/:roomId").post(ChatController.sendMessage);
  }

}