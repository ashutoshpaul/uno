import { COLOR_CODE } from "../enums/card-enums/card-colors.enum";
import { CARD_POINTS } from "../enums/card-enums/card-points.enum";
import { CARD_ACTION, CARD_NUMBER, CARD_TYPE, CARD_WILD } from "../enums/card-enums/card-types.enum";
import { IActionCard, INumberCard, IWildCard } from "../interfaces/card-interfaces/card-data.interface";
import { ICard } from "../interfaces/card-interfaces/card.interface";

const CARDS_PACK: ICard[] = [
    // NUMBER CARDS
    // blue
    { id: "blue-0", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.zero, points: CARD_POINTS.zero 
    }},
    { id: "blue-1", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "blue-2", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "blue-3", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "blue-4", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "blue-5", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "blue-6", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "blue-7", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "blue-8", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "blue-9", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.blue, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // green
    { id: "green-0", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.zero, points: CARD_POINTS.zero 
    }},
    { id: "green-1", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "green-2", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "green-3", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "green-4", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "green-5", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "green-6", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "green-7", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "green-8", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "green-9", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.green, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // red
    { id: "red-0", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.zero, points: CARD_POINTS.zero 
    }},
    { id: "red-1", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "red-2", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "red-3", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "red-4", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "red-5", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "red-6", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "red-7", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "red-8", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "red-9", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.red, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // yellow
    { id: "yellow-0", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.zero, points: CARD_POINTS.zero 
    }},
    { id: "yellow-1", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.one, points: CARD_POINTS.one 
    }},
    { id: "yellow-2", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.two, points: CARD_POINTS.two 
    }},
    { id: "yellow-3", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.three, points: CARD_POINTS.three 
    }},
    { id: "yellow-4", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.four, points: CARD_POINTS.four 
    }},
    { id: "yellow-5", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.five, points: CARD_POINTS.five 
    }},
    { id: "yellow-6", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.six, points: CARD_POINTS.six 
    }},
    { id: "yellow-7", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.seven, points: CARD_POINTS.seven 
    }},
    { id: "yellow-8", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.eight, points: CARD_POINTS.eight 
    }},
    { id: "yellow-9", type: CARD_TYPE.number, data: <INumberCard>{
        color: COLOR_CODE.yellow, number: CARD_NUMBER.nine, points: CARD_POINTS.nine 
    }},

    // ACTION CARDS
    // blue
    { id: "blue-draw-2", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.blue, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "blue-reverse", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.blue, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "blue-skip", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.blue, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // green
    { id: "green-draw-2", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.green, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "green-reverse", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.green, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "green-skip", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.green, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // red
    { id: "red-draw-2", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.red, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "red-reverse", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.red, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "red-skip", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.red, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // yellow
    { id: "yellow-draw-2", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.yellow, action: CARD_ACTION.drawTwoCards, points: CARD_POINTS.twenty
    }},
    { id: "yellow-reverse", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.yellow, action: CARD_ACTION.reverse, points: CARD_POINTS.twenty
    }},
    { id: "yellow-skip", type: CARD_TYPE.action, data: <IActionCard>{
        color: COLOR_CODE.yellow, action: CARD_ACTION.skip, points: CARD_POINTS.twenty
    }},

    // WILD CARDS
    { id: "wild-change-color", type: CARD_TYPE.wild, data: <IWildCard>{
        color: COLOR_CODE.black, wild: CARD_WILD.changeColor, points: CARD_POINTS.fifty
    }},
    { id: "wild-draw-4", type: CARD_TYPE.wild, data: <IWildCard>{
        color: COLOR_CODE.black, wild: CARD_WILD.drawFourCards, points: CARD_POINTS.fifty
    }},
];

// total: 104 cards (excluding 4 blank cards)
export const CARDS = [...CARDS_PACK, ...CARDS_PACK];