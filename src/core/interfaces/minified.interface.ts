/**
 * Whenever a client connects to a room (client has got playerId and roomId),
 * then an IConnection entity is added.
 * Used to claim the player by the client on new connection (eg. page refresh).
 * Also, used to remove the player from the room on leave-game event triggered by the player.
 * 
 * REDIS Schema: { { socket.id (key): IConnection (value) }, ...}
 */

import { STATUS } from "../enums/status.enum";

export interface IMinifiedRoom {
  id: string;
  name: string;
  createdBy?: IMinifiedPlayer;
  isAvailable: boolean;
}

export interface IMinifiedPlayer {
  id: string;
  name: string;
  status: STATUS;

  /**
   * * Should ONLY be present in 'identities' (REDIS)
   * * Add as soon as connection-disconnected.
   * * Remove on connection-reestablished (socket-id updated).
   */
  disconnectedAt?: Date;
}

export interface IMinifiedIdentity {
  player: IMinifiedPlayer;
  room: IMinifiedRoom;
}