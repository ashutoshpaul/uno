import { IPlayer, ISecuredPlayer } from "./player.interface";

export interface IMappedPlayers {
  top: ISecuredPlayer | null;
  right: ISecuredPlayer | null;
  left: ISecuredPlayer | null;
  bottom: IPlayer; // me
}