import { COLOR_CODE } from "../enums/card-enums/card-colors.enum";
import { CARD_POINTS } from "../enums/card-enums/card-points.enum";
import { CARD_ACTION, CARD_NUMBER, CARD_TYPE, CARD_WILD } from "../enums/card-enums/card-types.enum";
import { IActionCard, INumberCard, IWildCard } from "../interfaces/card-interfaces/card-data.interface";
import { ICard } from "../interfaces/card-interfaces/card.interface";

const CARDS_PACK: ICard[] = [
    // NUMBER CARDS
    // blue
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // green
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // red
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // yellow
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // ACTION CARDS
    // blue
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.blue, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.blue, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.blue, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // green
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.green, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.green, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.green, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // red
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.red, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.red, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.red, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // yellow
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.yellow, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.yellow, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.yellow, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // WILD CARDS
    { id: "", type: CARD_TYPE.wild, data: <IWildCard>{
        color: COLOR_CODE.black, wild: CARD_WILD.changeColor, points: CARD_POINTS.fifty
    }},
    { id: "", type: CARD_TYPE.wild, data: <IWildCard>{
        color: COLOR_CODE.black, wild: CARD_WILD.drawFourCards, points: CARD_POINTS.fifty
    }},
];

// total: 100 cards (excluding 8 blank cards)
export const CARDS = [...CARDS_PACK, ...CARDS_PACK];