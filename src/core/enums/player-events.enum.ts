// all actions performed by the player
export const enum PLAYER_EVENTS {
    play = 'play',
    wait = 'wait', // wait for his/her turn to play

    createRoom = 'createRoom',
    joinRoom = 'joinRoom',
    leaveRoom = 'leaveRoom',
    deleteRoom = 'deleteRoom',

    waitingForPlayersToJoinGame = 'waitingForPlayersToJoinGame', // waiting for other players to join
    allJoinedGame = 'allJoinedGame', // all players joined
    leaveGame = 'leaveGame', // leave the game

    offline = 'offline', // opponent went offline
    online = 'online', // opponent came back online
    removePlayer = 'removePlayer',

    drawCard = 'drawCard',
    discard = 'discard', // throw card
    skipChance = 'skipChance', // when you already picked a card and don't want to discard
    uno = 'uno', // player shouts UNO
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

    // automatic events
    shuffle = 'shuffle',
    discardFirstCard = 'discardFirstCard',
    distributeCards = 'distributeCards',
}