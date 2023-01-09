import { CARDS } from "../constants/cards.constants";
import { COLOR_CODE } from "../enums/card-enums/card-colors.enum";
import { CARD_ACTION, CARD_TYPE } from "../enums/card-enums/card-types.enum";
import { DIRECTION } from "../enums/direction.enum";
import { IActionCard } from "../interfaces/card-interfaces/card-data.interface";
import { ICard } from "../interfaces/card-interfaces/card.interface";
import { IGame } from "../interfaces/game.interface";
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
    updatedRoom.game.drawerDeckCards = GameService._shuffleCards(CARDS);
    
    updatedRoom.isAvailable = false;
    updatedRoom.game.isGameStarted = true;

    return updatedRoom;
  }

  // distribute TOTAL_CARDS cards to players
  public static distributeCards(game: IGame): IGame {
    const TOTAL_CARDS: number = 7;
    let card: ICard | undefined;

    for (let i: number = 1; i <= TOTAL_CARDS; i++) {
      for (let playerIndex: number = 0; playerIndex < game.players.length; playerIndex++) {
        card = game.drawerDeckCards.pop();
        card && game.players[playerIndex].cards.push(card);
      }
    }
    return game;
  }

  /**
   * Logically discards-first-card for updating the game's state in 'rooms' REDIS.
   */
  public static discardFirstCard(game: IGame): IGame {
    const updatedGame: IGame = game;
    const lastDrawnCard: ICard | undefined = updatedGame.drawerDeckCards.pop();
    if (lastDrawnCard) {
      updatedGame.discardPileCards.push(lastDrawnCard);
      updatedGame.lastDrawnCard = lastDrawnCard;
      updatedGame.currentColor = lastDrawnCard.data.color != COLOR_CODE.black ? lastDrawnCard.data.color : undefined;
      updatedGame.currentDirection = game.currentDirection ? game.currentDirection : DIRECTION.clockwise;
      
      // handles reverse-action on firstDrawnCard. TODO: handle other actions like +4, change-color, etc.
      if (lastDrawnCard.type == CARD_TYPE.action && (lastDrawnCard.data as IActionCard).action == CARD_ACTION.reverse) {
        updatedGame.currentDirection = game.currentDirection == DIRECTION.clockwise
          ? DIRECTION.antiClockwise
          : DIRECTION.clockwise
      }
    } else { throw new Error('drawerDeck is empty!'); }
    return updatedGame;
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