export enum COLOR_CODE {
  black = 'black',
  blue = 'blue',
  green = 'green',
  red = 'red',
  yellow = 'yellow',
}

export type ValidColorCodeType = Exclude<COLOR_CODE, COLOR_CODE.black>;