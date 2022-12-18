import { IPlayer, ISecuredPlayer } from "./player.interface";

export interface IMappedPlayers {
  front: ISecuredPlayer | null;
  right: ISecuredPlayer | null;
  left: ISecuredPlayer | null;
  me: IPlayer; // me
}