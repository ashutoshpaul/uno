import { CARD_POINTS, CARD_TYPE } from "../enums/card.enum";

export interface ICard {
    id: string;
    type: CARD_TYPE;
    score: CARD_POINTS;
}