import { ValidColorCodeType } from "../enums/card-enums/card-colors.enum";
import { DIRECTION } from "../enums/direction.enum";
import { PLAYER_POSITION } from "../enums/player-position.enum";
import { ICard } from "./card-interfaces/card.interface";
import { IMappedPlayers } from "./mapped-players.interface";
import { IMessage } from "./message.interface";
import { IMinifiedPlayer } from "./minified.interface";
import { IPlayer } from "./player.interface";

/**
 * * Stores the current game state in REDIS.
 * * Should NOT be sent to front-end once the game has started because it contains the cards of each player.
 * * Can lead to security issue if sent to front-end!
 * * Use IMappedGame instead.
 */
export interface IGame {
  players: IPlayer[];
  drawerDeckCards: ICard[];
  discardPileCards: ICard[];
  chats: IMessage[];
  isGameStarted: boolean;

  currentDirection: DIRECTION;

  lastDrawnCard?: ICard;
  currentColor?: ValidColorCodeType;
  currentPlayer?: IMinifiedPlayer;
}

/**
 * * Contains mapped players based on position.
 * * Each player has its own IMappedGame.
 * * Should be sent to front-end once the game has started.
 */
export interface IMappedGame {
  mappedPlayers: IMappedPlayers;
  isGameStarted: boolean;
  
  currentDirection: DIRECTION;
  
  lastDrawnCard?: ICard;
  currentColor?: ValidColorCodeType;
  currentPlayer?: {
    player: IMinifiedPlayer;
    position: PLAYER_POSITION;
  };
}