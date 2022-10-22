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

export type NumberCardPointsType = Exclude<CARD_POINTS, [CARD_POINTS.twenty, CARD_POINTS.fifty]>;
export type ActionCardPointsType = Extract<CARD_POINTS, CARD_POINTS.twenty>;
export type WildCardPointsType = Extract<CARD_POINTS, CARD_POINTS.fifty>;