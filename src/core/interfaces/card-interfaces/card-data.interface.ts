import { VALID_COLOR_CODE, COLOR_CODE } from "src/core/enums/card-enums/card-colors.enum";
import { NumberCardPointsType, ActionCardPointsType, WildCardPointsType } from "src/core/enums/card-enums/card-points.enum";
import { CARD_NUMBER, CARD_ACTION, CARD_WILD } from "src/core/enums/card-enums/card-types.enum";

export interface INumberCard {
    number: CARD_NUMBER;
    score: NumberCardPointsType,
    color: VALID_COLOR_CODE,
}

export interface IActionCard {
    action: CARD_ACTION,
    score: ActionCardPointsType,
    color: VALID_COLOR_CODE,
}

export interface IWildCard {
    wild: CARD_WILD,
    score: WildCardPointsType,
    readonly color: COLOR_CODE.black,
}