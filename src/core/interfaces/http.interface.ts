import { IMinifiedIdentity, IMinifiedPlayer, IMinifiedRoom } from "./minified.interface";

export interface IUpdateSocketIdPayload {
  socketId: string;
  identity: IMinifiedIdentity;
}

export interface ICreateRoomPayload {
  playerName: string;
  roomName: string;
}

export interface IJoinRoomPayload {
  playerName: string;
  room: IMinifiedRoom;
}

export interface ILobbyRoomResponse {
  createdBy: IMinifiedPlayer;
  isGameStarted: boolean;
  status?: any; // MANDATORY is front-end
  players: IMinifiedPlayer[],
  name: string;
  id: string;
}