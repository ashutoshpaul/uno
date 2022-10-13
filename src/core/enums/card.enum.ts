export enum COLOR_CODE {
    black = 'black',
    blue = 'blue',
    green = 'green',
    red = 'red',
    yellow = 'yellow',
}

export type VALID_COLOR_CODE = Exclude<COLOR_CODE, COLOR_CODE.black>;

export enum CARD_TYPE {
    number = 'number',
    action = 'action', // skip, reverse and draw-two
    wild = 'wild', // change-color and draw-four
}

export enum CARD_POINTS {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
    four = 4,
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    twenty = 20, // draw-two, reverse and skip
    fifty = 50, // wild cards (change-color and draw-four)
}