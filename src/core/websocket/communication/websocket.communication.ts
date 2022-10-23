import { GAME_EVENTS } from "src/core/enums/game-events.enum";
import { PLAYER_EVENTS } from "src/core/enums/player-events.enum";
import { RESPONSE_EVENTS } from "src/core/enums/response-events.enum";
import { IMinifiedIdentity, IMinifiedRoom } from "src/core/interfaces/minified.interface";
import { RoomHandler } from "../handlers/room.handler";

export class WebsocketCommunication {

  static registerEvents(socket: any): void {
    // Player Events
    socket.on(PLAYER_EVENTS.allJoinedGame, () => {
      console.log(PLAYER_EVENTS.allJoinedGame);
    });

    // Room Events
    socket.on(PLAYER_EVENTS.createRoom, async (playerName: string, roomName: string) => {
      console.log(PLAYER_EVENTS.createRoom);
      const identity: IMinifiedIdentity | null = await RoomHandler.createRoom(socket, playerName, roomName);
      if (identity) {
        socket.emit(RESPONSE_EVENTS.roomCreated, identity);
      } else {
        socket.emit(RESPONSE_EVENTS.failed, null);
      }
    });

    socket.on(PLAYER_EVENTS.joinRoom, async (playerName: string, room: IMinifiedRoom) => {
      console.log(PLAYER_EVENTS.joinRoom);
      const identity: IMinifiedIdentity | null = await RoomHandler.joinRoom(socket, playerName, room);
      if (identity) {
        socket.emit(RESPONSE_EVENTS.roomJoined, identity);
      } else {
        socket.emit(RESPONSE_EVENTS.failed, null);
      }
    });

    socket.on(PLAYER_EVENTS.deleteRoom, () => {
      console.log(PLAYER_EVENTS.deleteRoom);
    });

    socket.on(PLAYER_EVENTS.discard, () => {
      console.log(PLAYER_EVENTS.discard);
    });

    socket.on(PLAYER_EVENTS.drawCard, () => {
      console.log(PLAYER_EVENTS.drawCard);
    });

    socket.on(PLAYER_EVENTS.joinGame, () => {
      console.log(PLAYER_EVENTS.joinGame);
    });

    socket.on(PLAYER_EVENTS.leaveGame, () => {
      console.log(PLAYER_EVENTS.leaveGame);
    });

    socket.on(PLAYER_EVENTS.leaveRoom, () => {
      console.log(PLAYER_EVENTS.leaveRoom);
    });

    socket.on(PLAYER_EVENTS.message, () => {
      console.log(PLAYER_EVENTS.message);
    });

    socket.on(PLAYER_EVENTS.play, () => {
      console.log(PLAYER_EVENTS.play);
    });

    socket.on(PLAYER_EVENTS.playerCameBackOnline, () => {
      console.log(PLAYER_EVENTS.playerCameBackOnline);
    });

    socket.on(PLAYER_EVENTS.playerWentOffline, () => {
      console.log(PLAYER_EVENTS.playerWentOffline);
    });


    socket.on(PLAYER_EVENTS.removePlayer, () => {
      console.log(PLAYER_EVENTS.removePlayer);
    });

    socket.on(PLAYER_EVENTS.skipChance, () => {
      console.log(PLAYER_EVENTS.skipChance);
    });

    socket.on(PLAYER_EVENTS.startGame, () => {
      console.log(PLAYER_EVENTS.startGame);
    });

    socket.on(PLAYER_EVENTS.uno, () => {
      console.log(PLAYER_EVENTS.uno);
    });

    socket.on(PLAYER_EVENTS.wait, () => {
      console.log(PLAYER_EVENTS.wait);
    });

    socket.on(PLAYER_EVENTS.waitingForPlayersToJoinGame, () => {
      console.log(PLAYER_EVENTS.waitingForPlayersToJoinGame);
    });

    // Game Events
    socket.on(GAME_EVENTS.changeColor, () => {
      console.log(GAME_EVENTS.changeColor);
    });

    socket.on(GAME_EVENTS.changeDirection, () => {
      console.log(GAME_EVENTS.changeDirection);
    });

    socket.on(GAME_EVENTS.colorChanged, () => {
      console.log(GAME_EVENTS.colorChanged);
    });

    socket.on(GAME_EVENTS.discardFirstCard, () => {
      console.log(GAME_EVENTS.discardFirstCard);
    });

    socket.on(GAME_EVENTS.distributeCards, () => {
      console.log(GAME_EVENTS.distributeCards);
    });

    socket.on(GAME_EVENTS.drawFourCards, () => {
      console.log(GAME_EVENTS.drawFourCards);
    });

    socket.on(GAME_EVENTS.drawTwoCards, () => {
      console.log(GAME_EVENTS.drawTwoCards);
    });

    socket.on(GAME_EVENTS.noCardsLeft, () => {
      console.log(GAME_EVENTS.noCardsLeft);
    });

    socket.on(GAME_EVENTS.shuffle, () => {
      console.log(GAME_EVENTS.shuffle);
    });

    socket.on(GAME_EVENTS.skipped, () => {
      console.log(GAME_EVENTS.skipped);
    });

    // Response Events
    socket.on(RESPONSE_EVENTS.failed, () => {
      console.log(RESPONSE_EVENTS.failed);
    });

    socket.on(RESPONSE_EVENTS.roomJoined, () => {
      console.log(RESPONSE_EVENTS.roomJoined);
    });

    socket.on(RESPONSE_EVENTS.roomLeft, () => {
      console.log(RESPONSE_EVENTS.roomLeft);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  }
}