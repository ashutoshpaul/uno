import { INumberCard, IActionCard, IWildCard } from "./card-data.interface";
import { CARD_TYPE } from "../../enums/card-enums/card-types.enum";

export interface ICard {
  id: string;
  type: CARD_TYPE;
  data: INumberCard | IActionCard | IWildCard;
}