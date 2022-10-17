import { ICard } from "./card-interfaces/card.interface";
import { IRoom } from "./room.interface";

export interface IPlayer {
    id: string;
    name: string;
    score: number;
    isActive: boolean; // false when the player is removed from the game
    room: IRoom;
    cards: ICard[];  // total cards in the player's cards tray.
}