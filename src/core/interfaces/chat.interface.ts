import { IPlayer } from "./player.interface";

export interface IChat {
  player: IPlayer;
  message: string;
  time: string;
}