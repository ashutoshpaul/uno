import { ICard } from "./card-interfaces/card.interface";
import { IChat } from "./chat.interface";
import { IPlayer } from "./player.interface";

export interface IGame {
  players: IPlayer[];
  drawerDeckCards: ICard[];
  discardPileCards: ICard[];
  chats: IChat[];
  isGameStarted: boolean;

  lastDrawnCard: ICard | null;
}