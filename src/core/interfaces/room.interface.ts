import { IGame } from "./game.interface";

export interface IRoom {
    id: string;
    roomName: string;
    game: IGame;
}