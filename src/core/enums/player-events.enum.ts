// all actions performed by player
export const enum PLAYER_EVENTS {
  play = 'play',
  wait = 'wait', // wait for his/her turn to play

  createRoom = 'createRoom',
  joinRoom = 'joinRoom',
  leaveRoom = 'leaveRoom',
  deleteRoom = 'deleteRoom',

  startGame = 'startGame', // player started game
  joinGame = 'joinGame', // player started game
  waitingForPlayersToJoinGame = 'waitingForPlayersToJoinGame',
  allJoinedGame = 'allJoinedGame',
  leaveGame = 'leaveGame',

  // playerWentOffline = 'playerWentOffline',
  // playerCameBackOnline = 'playerCameBackOnline',
  removePlayer = 'removePlayer',

  drawCard = 'drawCard',
  discard = 'discard', // throw card
  skipChance = 'skipChance', // when you already picked a card and don't want to discard
  uno = 'uno', // player shouts UNO

  message = 'message', // player sent message in chat

  aborted = 'aborted', // Represents player has closed the tab (also sent on page-unload).
}