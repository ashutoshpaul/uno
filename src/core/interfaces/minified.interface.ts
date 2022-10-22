/**
 * Whenever a client connects to a room (client has got playerId and roomId),
 * then an IConnection entity is added.
 * Used to claim the player by the client on new connection (eg. page refresh).
 * Also, used to remove the player from the room on leave-game event triggered by the player.
 * 
 * REDIS Schema: { { socket.id (key): IConnection (value) }, ...}
 */

interface IMinifiedRoom {
  id: string;
  name: string;
}

interface IMinifiedPlayer {
  id: string;
  name: string;
}

export interface IMinifiedIdentity {
  player: IMinifiedPlayer;
  room: IMinifiedRoom;
}