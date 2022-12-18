import { ICard } from "./card-interfaces/card.interface";

export interface IPlayer {
  id: string;
  name: string;
  score: number;

  /**
   * false (default) when the player is removed from the game. Set to true when player enters the game
   *  */
  isActive: boolean;

  cards: ICard[];  // cards in the player's cards tray.
  isCardLeft: boolean; // false when the player has played all his/her cards
}

/**
 * * Copy of IPlayer with a single difference.
 * * Has cardsCount (number) instead of cards (ICard[]).
 * * Used in IMappedPlayers and sent to front-end.
 */
export interface ISecuredPlayer {
  id: string;
  name: string;
  score: number;

  /**
   * false (default) when the player is removed from the game. Set to true when player enters the game
   *  */
  isActive: boolean;

  cardsCount: number;  // cards in the player's cards tray.
  isCardLeft: boolean; // false when the player has played all his/her cards
}