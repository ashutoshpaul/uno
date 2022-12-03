import { IMinifiedPlayer } from "./minified.interface";

export interface IMessage {
  author: IMinifiedPlayer;
  content: string;
  time: string;
  isSentByMe?: boolean; // required in front-end
}