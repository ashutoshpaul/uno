import { WebSocketService } from "../services/websocket.service";

export class WebsocketConfig {
  static count = 0;

  static registerEvents(socket: any): void {

    socket.on('increment', () => {
      this.count = WebSocketService.increment(this.count);
      console.log('--------- INC', this.count);
      socket.emit('increment', this.count);
    });
  
    socket.on('decrement', () => {
      this.count = WebSocketService.decrement(this.count);
      console.log('--------- DEC', this.count);
      socket.emit('decrement', this.count);
    });
  
    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  }
}