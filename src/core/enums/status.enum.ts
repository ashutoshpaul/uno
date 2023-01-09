/**
 * ## Plays main role to determine whether the player is online, offline or aborted the game (tab-closed).
 * 
 * Entire logic explained.
 * 
 * * There are total 3 events that leads to socket disconnection:
 * 
 * > 1. tab refreshed.
 * > 2. tab closed.
 * > 3. network disconnected.
 * 
 * * In frontend total 2 functions are there to capture page unload events. 
 *   Disconnect event is triggered automatically when network is disconnected.
 * 
 * * The order in which these events get triggered.
 * 
 * > 1. 1st -> window:beforeunload
 * > 2. 2nd -> socket.disconnect event is triggered automatically
 * 
 * * Now, in backend 2 event-listers are going to handle the above 3 events in special ways:
 * 
 * > 1. PLAYER_EVENTS.aborted
 * > 2. disconnect
 * 
 * ### Finding out what the player wants to do and which events will get triggered based on player's action
 * 
 * > 1.. refresh: Player will refresh the page.
 *   >> * First, window:beforeunload will get triggered.
 *   >> * Second, socket.disconnect event will get triggered.
 * 
 * > 2.. aborted: Player closed the tab.
 *   >> (same as 'refresh').
 * 
 * > 3.. network-disconnect: Player went offline.
 *   >> * Only 'disconnect' event is triggered.
 
 */
export enum STATUS {
  aborted = 'aborted',
  offline = 'offline',

  /**
   * default
   */
  online = 'online',
}