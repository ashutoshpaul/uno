/**
 * all reactions received due to actions performed by the opponent and other events 
 * triggered by the cards
 */
export const enum GAME_EVENTS {
  drawTwoCards = 'drawTwoCards',
  drawFourCards = 'drawFourCards',
  
  changeColor = 'changeColor', // choosing a color
  colorChanged = 'colorChanged',  // color chosen
  
  changeDirection = 'changeDirection',
  skipped = 'skipped',
  
  // automatic events
  shuffle = 'shuffle',
  discardFirstCard = 'discardFirstCard',
  distributeCards = 'distributeCards',
  noCardsLeft = 'noCardsLeft',
}