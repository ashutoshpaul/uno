export enum CARD_TYPE {
  number = 'number',
  action = 'action', // skip, reverse and draw-two
  wild = 'wild', // change-color and draw-four
}

export enum CARD_NUMBER {
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
}

export enum CARD_ACTION {
  reverse = 'reverse',
  skip = 'skip',
  drawTwoCards = 'drawTwoCards',
}

export enum CARD_WILD {
  changeColor = 'changeColor',
  drawFourCards = 'drawFourCards',
}