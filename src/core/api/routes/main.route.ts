import express from "express";
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
  }

}