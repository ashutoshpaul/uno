import { GAME_EVENTS, PLAYER_EVENTS } from "../enums/player-events.enum";

export class WebsocketConfig {
  static count = 0;

  static registerEvents(socket: any): void {

    // socket.on('increment', () => {
    //   this.count = WebSocketService.increment(this.count);
    //   console.log('--------- INC', this.count);
    //   socket.emit('increment', this.count);
    // });

    // socket.on('decrement', () => {
    //   this.count = WebSocketService.decrement(this.count);
    //   console.log('--------- DEC', this.count);
    //   socket.emit('decrement', this.count);
    // });

    // Player Events
    socket.on(PLAYER_EVENTS.allJoinedGame, () => {
      console.log(PLAYER_EVENTS.allJoinedGame);
    });

    socket.on(PLAYER_EVENTS.createRoom, () => {
      console.log(PLAYER_EVENTS.createRoom);
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

    socket.on(PLAYER_EVENTS.joinRoom, () => {
      console.log(PLAYER_EVENTS.joinRoom);
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

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  }
}