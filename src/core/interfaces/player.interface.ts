import { ICard } from "./card-interfaces/card.interface";

export interface IPlayer {
  id: string;
  name: string;
  score: number;
  isActive: boolean; // false when the player is removed from the game
  cards: ICard[];  // cards in the player's cards tray.
  isCardsLeft: boolean; // false when the player has played all his/her cards
}