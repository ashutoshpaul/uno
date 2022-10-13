// all actions performed by the player
export const enum PLAYER_EVENTS {
    play =  'play',
    watch = 'watch',

    createRoom = 'createRoom',
    waiting = 'waiting', // waiting for other players to join
    joined = 'joined', // all players joined
    leave = 'leave', // leave the game
    deleteRoom = 'deleteRoom',

    offline = 'offline', // opponent went offline
    online = 'online', // opponent came back online
    removePlayer = 'removePlayer',

    drawCard = 'drawCard',
    discard = 'discard', // throw card
    skipChance = 'skipChance', // when you already picked a card and don't want to discard
}

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
}