/**
 * Whenever a client connects to a room (client has got playerId and roomId),
 * then an IConnection entity is added.
 * Used to claim the player by the client on new connection (eg. page refresh).
 * Also, used to remove the player from the room on leave-game event triggered by the player.
 * 
 * REDIS Schema: { { socket.id (key): IConnection (value) }, ...}
 */

export interface IConnection {
  player: {
    playerId: string;
    playerName: string;
  }
  room: {
    roomId: string;
    roomName: string;
  }
}