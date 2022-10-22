// all actions performed by the backend logic
export const enum RESPONSE_EVENTS {
  roomCreated = 'roomCreated',
  roomJoined = 'roomJoined',
  roomLeft = 'roomLeft',
  roomDeleted = 'roomDeleted',

  // startGame = 'startGame', // player started game
  // joinGame = 'joinGame', // player started game
  // waitingForPlayersToJoinGame = 'waitingForPlayersToJoinGame',
  // allJoinedGame = 'allJoinedGame',
  // leaveGame = 'leaveGame',
  
  // playerWentOffline = 'playerWentOffline',
  // playerCameBackOnline = 'playerCameBackOnline',
  // removePlayer = 'removePlayer',
  
  // drawCard = 'drawCard',
  // discard = 'discard', // throw card
  // skipChance = 'skipChance', // when you already picked a card and don't want to discard
  // uno = 'uno', // player shouts UNO
  
  // message = 'message', // player sent message in chat

  failed = 'failed', // error ocurred
}
