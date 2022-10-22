import { IGame } from "./game.interface";

export interface IRoom {
    id: string;
    name: string;
    game: IGame;
}