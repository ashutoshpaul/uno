import express from "express";
import { PlayerController } from "../controllers/player.controller";
import { RoomController } from "../controllers/room.controller";

export class MainRoute {

  public register(app: express.Application): void {
    app.route("/identity").post(PlayerController.updateSocketId);
    app.route("/rooms").get(RoomController.getRooms);
  }

}