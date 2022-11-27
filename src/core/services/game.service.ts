import { CARDS } from "../constants/cards.constants";
import { ICard } from "../interfaces/card-interfaces/card.interface";
import { IRoom } from "../interfaces/room.interface";

export class GameService {
  
  /**
   * Creates a new game.
   * 1. Shuffle cards and store in 'drawerDeckCards'
   * 2. Update 'isAvailable' = false and 'isGameStarted' = true.
   */
  public static newGame(room: IRoom): IRoom {
    const updatedRoom: IRoom = room;
    updatedRoom.game.discardPileCards = [];
    updatedRoom.game.lastDrawnCard = null;
    updatedRoom.game.drawerDeckCards = GameService._shuffleCards(CARDS);
    
    updatedRoom.isAvailable = false;
    updatedRoom.game.isGameStarted = true;

    return updatedRoom;
  }

  /**
   * Uses Fisher-Yates shuffle algorithm
   * @param cards ICard[]
   * @returns shuffled cards
   */
  private static _shuffleCards(cards: ICard[]): ICard[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const swapIndex: number = Math.floor(Math.random() * (i + 1))
      const currentCard: ICard = cards[i];
      const cardToSwap: ICard = cards[swapIndex];
      cards[i] = cardToSwap;
      cards[swapIndex] = currentCard;
    }
    return cards;
  }

}