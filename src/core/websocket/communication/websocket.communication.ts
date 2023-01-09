import { Socket } from "socket.io";
import { GAME_EVENTS } from "./../../enums/game-events.enum";
import { PLAYER_EVENTS } from "./../../enums/player-events.enum";
import { RESPONSE_EVENTS } from "./../../enums/response-events.enum";

export class WebsocketCommunication {

  /**
   * 
   * @param socket client emitting the event
   * @param roomId client's room
   * @param event event type
   * @param response data to be sent to other clients present in the room
   */
  public static emit(
    socket: Socket,
    roomId: string,
    event: PLAYER_EVENTS | GAME_EVENTS | RESPONSE_EVENTS, 
    response: any,
  ): void {
    switch(event) {
      case RESPONSE_EVENTS.roomDeleted:
      case GAME_EVENTS.shuffle:
        socket.to(roomId).emit(event);
        break;
      case RESPONSE_EVENTS.roomJoined:
      case RESPONSE_EVENTS.playerRemoved:
      case RESPONSE_EVENTS.roomLeft:
      case RESPONSE_EVENTS.gameStarted:
      case RESPONSE_EVENTS.gameJoined:
      case RESPONSE_EVENTS.connectionToggled:
      case PLAYER_EVENTS.message:
        socket.to(roomId).emit(event, response);
        break;
    }
  }

  /**
   * 
   * @param socket client emitting the event
   * @param event event type
   * @param response data to be sent to other client
   */
  public static emitToSocket(
    socket: Socket,
    event: PLAYER_EVENTS | GAME_EVENTS | RESPONSE_EVENTS,
    response: any,
  ): void {
    switch(event) {
      case RESPONSE_EVENTS.roomDeleted:
      case RESPONSE_EVENTS.roomLeft:
      case RESPONSE_EVENTS.gameJoined:
      case RESPONSE_EVENTS.connectionToggled:
      case GAME_EVENTS.distributeCards:
      case GAME_EVENTS.discardFirstCard:
        socket.emit(event, response);
        break;
    }
  }
}