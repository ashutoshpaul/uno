import { IGame } from "./game.interface";
import { IMinifiedPlayer } from "./minified.interface";

export interface IRoom {
  id: string;
  name: string;
  game: IGame;
  createdBy: IMinifiedPlayer;
}