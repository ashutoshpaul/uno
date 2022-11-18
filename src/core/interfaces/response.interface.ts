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

export interface IPlayerRemovePayload {
  actionPlayer: IMinifiedPlayer;
  playerToBeRemoved: IMinifiedPlayer;
}

export interface IJoinRoomResponse {
  identity: IMinifiedIdentity;
  room: ILobbyRoomResponse;
}

export interface ILobbyRoomResponse {
  createdBy: IMinifiedPlayer;
  isGameStarted: boolean;
  status?: any; // MANDATORY is front-end
  players: IMinifiedPlayer[],
  name: string;
  id: string;
}

export interface IPlayerLeftRoomResponse {
  playerName: string;
  room: ILobbyRoomResponse;
}

export interface IPlayerRemovedResponse {
  actionPlayer: string;
  playerRemoved: IMinifiedPlayer;
  room: ILobbyRoomResponse;
}