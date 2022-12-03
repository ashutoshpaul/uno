import { ICard } from "./card-interfaces/card.interface";
import { IMessage } from "./message.interface";
import { IPlayer } from "./player.interface";

export interface IGame {
  players: IPlayer[];
  drawerDeckCards: ICard[];
  discardPileCards: ICard[];
  chats: IMessage[];
  isGameStarted: boolean;

  lastDrawnCard: ICard | null;
}