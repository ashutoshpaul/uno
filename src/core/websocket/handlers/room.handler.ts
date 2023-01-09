import { socketIO } from "./../../../app";
import { IRoom } from "../../interfaces/room.interface";
import { IMinifiedIdentity, IMinifiedPlayer } from "../../interfaces/minified.interface";
import { WebsocketCommunication } from "../communication/websocket.communication";
import { RESPONSE_EVENTS } from "../../enums/response-events.enum";
import { IPlayer } from "../../interfaces/player.interface";
import { RoomService } from "../../services/room.service";
import { STATUS } from "../../enums/status.enum";
import { IConnectionUpdatedResponse, IJoinedPlayersResponse, IPlayerLeftRoomResponse } from "../../interfaces/response.interface";
import { IPlayerSocket } from "../../interfaces/player-socket.interface";
import { GameMapService } from "../../services/game-map.service";
const Redis = require("ioredis");

const redis = new Redis();

export class RoomHandler {

  /**
   * ### When a player goes offline. 
   * * Reasons:
   * > 1. screen-refresh
   * > 2. tab closed
   * > 3. network disconnected
   * 
   * * I don't want to emit 'offline'|'aborted' event on screen-refresh.
   * 
   * * Always called at the end.
   * > 1. For refresh: PLAYER_EVENTS.aborted -> here
   * > 2. For tab-close: PLAYER_EVENTS.aborted -> here.
   * > 3. For network disconnected: here (directly).
   * 
   * * PLAYER_EVENTS.aborted sets "status = 'aborted'".
   * 
   * * ### Steps:
   * 1. Using socketId fetch identity from REDIS ('identities').
   * 2. set 'disconnectedAt' in REDIS ('identities').
   * 3. Check status
   * 
   * > 1.. 'status' == 'aborted'
   *  >> * Player has closed-tab/screen-refresh.
   *  >> * This block also identifies 'screen-refresh' event and handles it.
   *  
   *  >> 1. Wait 5 seconds. Why? If the player has refreshed-screen then (let's say) within 2 seconds a 
   *        new-connection will be established and updateSocketId() would have set "status = 'online'".
   *        If the player has closed-tab then socketId will remain unchanged and status = 'aborted' (unchanged).
   *  >> 2. Check status.
   *   
   *   >>> 1.. 'status' == 'online' (i.e., player is back online)
   *    >>>> 1. Don't do anything.
   * 
   *   >>> 2.. 'status' == 'aborted' (i.e., player has closed tab)
   *    >>>> 1. If player is Host then go to A.
   *    >>>> 2. If player is NOT host then go to B.
   * 
   * > 2.. 'status' == 'online'
   *  >> * Player went offline.
   *  
   *  >> 1. Wait 5 seconds. Set status = 'offline' in REDIS ('identities') and in 
   *        players-list present in REDIS ('rooms').
   *  >> 2. If player is Host then set 'createdBy' with status = 'offline' in REDIS ('identities'|'rooms').
   *  >> 3. Emit event one by one (because socket no longer exists) to affected room players.
   * 
   * 
   * ### A - player aborted is Host
   *  > 1. Delete room from 'rooms' (REDIS).
   *  > 2. Fetch all players from 'identities' (REDIS).
   *  > 3. Broadcast 'room-deleted' event to affected room players.
   *  > 4. Delete + unregister all players connected to the room (host-socket automatically deleted) in 'identities' (delete keys via socketId)
   *  > 5. In front-end, delete identity of affected room players.
   * 
   * ### B - player aborted is NOT Host
   *  > 1.. If game started:
   *   >> 1. Set isActive = false. Update room in 'rooms' (REDIS).
   *   >> 2. Delete player's identity from 'identities' (REDIS).
   *   >> 3. Broadcast player-left event to affected room players.
   *   >> 4. Broadcast 'gameJoined' event with IJoinedPlayersResponse to affected room players 
   *         (this updates the player-joined-dialog).
   * 
   *  > 2.. If game NOT started:
   *   >> 1. Remove player from players[] in room.game of 'rooms' (REDIS).
   *   >> 2. Update rooms's availability ('isAvailable').
   *   >> 3. Delete player's identity from 'identities' (REDIS).
   *   >> 4. Broadcast player-left event to affected room players.
   *   >> 5. Remove socket from the room.
   * 
   * 
   * ## socket reconnected
   * 
   * 1. Set "status = 'online'" of 'identity'|'room' of Player.
   * 2. If player is Host then set createdBy.status = 'online' in REDIS ('rooms').
   * 3. If 'disconnectedAt' is present && 'disconnectedAt' < 5 seconds, then
   *  
   *  > * It means that it was a screen-refresh.
   *  > 1. Don't do anything. No event should be sent on screen-refresh.
   * 
   * 4. else,
   *  
   *  > * Player came-back-online because since 5 seconds there was no socket|identity-update.
   *  > * Player was disconnected atleast for the last 5 seconds.
   *  > 1. Emit 'player-back-online' event to affected room players.
   * 
   * 5. Remove 'disconnectedAt' from REDIS ('identities).
   * 
   * ### Which status will get updated?
   * 1. Update identity.player.status = 'online' in REDIS ('identities').
   * 2. If player is Host then update identity.room.createdBy.status = 'online' in REDIS ('identities').
   * 3. Update room.game.players[index].status = 'online' in REDIS ('rooms').
   * 4. If player is Host then update room.createdBy.status = 'online' in REDIS ('rooms').
   * 
   * * room.game.players[index].status is updated after 5 seconds.
   * 
   * 
   * ### Emit event:
   * 
   * > Need to emit event one by one because socket no longer exists.
   * 
   * 1. Grab socketIds of other players.
   * 2. Emit respective events to players one by one.
   * 
   * > Types of events:
   * 
   * 1. On 'abort' + players was Host -> room-delete-event
   * 2. On 'abort' + players is NOT Host -> player-left-room-event
   * 3. On 'offline' -> player-went-offline-event
   * 
   * #### Notes:
   * * disconnectedAt should ONLY be added in 'identities'. No where else.
   * * On update-connection status = 'online', and disconnectedAt should be removed.
   * 
   */
  static async playerDisconnected(socketId: string) {
    const identity: IMinifiedIdentity = JSON.parse(await redis.hget('identities', socketId));
    if (identity) {
      identity.player.disconnectedAt = new Date();
      await redis.hset('identities', socketId, JSON.stringify(identity)); // update

      if (identity.player.status == STATUS.aborted) {
        setTimeout(async () => {
          const refetchIdentity: IMinifiedIdentity = JSON.parse(await redis.hget('identities', socketId));

          if (refetchIdentity && refetchIdentity.player.status == STATUS.aborted) {
            // check player was Host or not
            const room: IRoom = JSON.parse(await redis.hget('rooms', refetchIdentity.room.id));
            if (room ) {
              if (refetchIdentity.player.id == room.createdBy.id) {
                console.log('-- host-abortion');
                RoomHandler._hostAbortion(socketId, refetchIdentity.player.id, room);
              } else {
                console.log('-- non-host-abortion');
                RoomHandler._nonHostAbortion(socketId, refetchIdentity, room);
              }
            } else throw new Error('room not found');
          } else console.log('new connection was made via updateSocket() <screen-refresh>');
        }, 5000);
      } else if (identity.player.status == STATUS.online) {
        setTimeout(async () => {
          const rawData: any = await redis.hgetall('identities');
          const list: Array<any> = [];
          
          for(let key in rawData) { 
            if(rawData.hasOwnProperty(key)) { 
              list.push({ key: key, value: JSON.parse(rawData[key]) }); 
            } 
          }

          if (list.length > 0) {
            const mappedList: {key: string, value: IMinifiedIdentity}[] = list;
            let refetchIdentity: IMinifiedIdentity | undefined;
            let key: string | undefined;
            mappedList.filter((e) => {
              if(e.value.player.id == identity.player.id
                && e.value.room.id == identity.room.id) {
                key = e.key; 
                refetchIdentity = e.value;
              } else {
                return e;
              }
            });

            if (socketId == key && refetchIdentity?.player.status == STATUS.online) {
              console.log('player-went-offline');
              const room: IRoom = JSON.parse(await redis.hget('rooms', refetchIdentity.room.id));
              if (room) RoomHandler._offlineProcess(socketId, refetchIdentity, room);
              else throw new Error('room not found');
            }
          }
        }, 5000);
      }
    } else console.log('socket-id not found! <not-an-error>');
  }

  /**
   * Called on window:beforeunload (user might have closed-tab or refreshed-page).
   * 
   * 1. Using socketId fetch identity from REDIS ('identities').
   * 2. Update identity with status = 'aborted' in REDIS ('identities').
   */
  static async playerAborted(socketId: string) {
    const identity: IMinifiedIdentity = JSON.parse(await redis.hget('identities', socketId));
    if (identity) {
      identity.player.status = STATUS.aborted;

      if (identity.room.createdBy?.id == identity.player.id) {
        identity.room.createdBy.status = STATUS.aborted;
      }
      await redis.hset('identities', socketId, JSON.stringify(identity)); // update
    }
  }

  /**
   * If player is NOT Host and identity.player.status == 'aborted':
   * 
   * 2. If game started:
   *  > 1. Set isActive = false and status = 'aborted'. Update room in 'rooms' (REDIS).
   *  > 2. Delete player's identity from 'identities' (REDIS).
   *  > 3. Broadcast player-left event to affected room players.
   *  > 4. Broadcast 'gameJoined' event with IJoinedPlayersResponse to affected room players
   *       (player joined the game but CLOSED THE TAB during countdown).
   * 
   * 2. If game NOT started:
   *  > 1. Remove player from players[] in room.game of 'rooms' (REDIS).
   *  > 2. Update rooms's availability ('isAvailable').
   *  > 3. Delete player's identity from 'identities' (REDIS).
   *  > 4. Broadcast player-left event to affected room players.
   * 
   * 
   * Copied from RoomHandler.playerDisconnected()
   */
  private static async _nonHostAbortion(socketId: string, identity: IMinifiedIdentity, room: IRoom) {
    if (room.game.isGameStarted) {
      const disconnectedPlayerIndex: number = room.game.players.findIndex(e => e.id == identity.player.id);
      if (disconnectedPlayerIndex != -1) {
        room.game.players[disconnectedPlayerIndex].isActive = false;
        room.game.players[disconnectedPlayerIndex].status = STATUS.aborted;

        await redis.hset("rooms", room.id, JSON.stringify(room)); // update
        await redis.hdel('identities', socketId);

        const otherOnlinePlayers: IPlayer[] = room.game.players.filter(e => e.status == STATUS.online && e.id != identity.player.id);
        const otherOnlinePlayerSockets: IPlayerSocket[] = await GameMapService.fetchSocketIds(otherOnlinePlayers);
        
        const response: IPlayerLeftRoomResponse = {
          playerName: identity.player.name,
          room: {
            createdBy: room.createdBy,
            id: room.id,
            isGameStarted: room.game.isGameStarted,
            players: room.game.players.map(player => <IMinifiedPlayer>{
              id: player.id,
              name: player.name,
              status: player.status,
            }),
            name: room.name,
          }
        };
        console.log('tab-closed (non-host room left after game started)');
        otherOnlinePlayerSockets.forEach(e => {
          const clientSocket = socketIO.sockets.sockets.get(e.socketId);
          if (clientSocket) {
            WebsocketCommunication.emitToSocket(clientSocket, RESPONSE_EVENTS.roomLeft, response);

            // Incase player-joined-dialog is open then it will get updated.
            const joinedPlayersCount: number = room.game.players.filter(e => e.isActive && e.status != STATUS.aborted).length || 0;
            const totalAvailablePlayers: number = room.game.players.filter(e => e.status != STATUS.aborted).length || 0;
            const joinedPlayersResponse: IJoinedPlayersResponse = {
              joinedPlayersCount: joinedPlayersCount,
              totalPlayersCount: totalAvailablePlayers,
            };
            WebsocketCommunication.emitToSocket(clientSocket, RESPONSE_EVENTS.gameJoined, joinedPlayersResponse);
          } else console.log("emitToSocket() socket ("+ e.socketId +") is missing! <tab-closed (non-host room left after game started)> <not-an-error>");
        });

      } else throw new Error('player not found!');
    } else {
      const filteredPlayers: IPlayer[] =  room.game.players.filter(e => e.id != identity.player.id);
      room.game.players = filteredPlayers;
      RoomService.updateRoomAvailability(room);

      await redis.hset("rooms", room.id, JSON.stringify(room)); // update
      await redis.hdel('identities', socketId);

      const otherOnlinePlayers: IPlayer[] = room.game.players.filter(e => e.status == STATUS.online && e.id != identity.player.id);
      const otherOnlinePlayerSockets: IPlayerSocket[] = await GameMapService.fetchSocketIds(otherOnlinePlayers);
      console.log('otherOnlinePlayerSockets', otherOnlinePlayerSockets.length);
      
      const response: IPlayerLeftRoomResponse = {
        playerName: identity.player.name,
        room: {
          createdBy: room.createdBy,
          id: room.id,
          isGameStarted: room.game.isGameStarted,
          players: room.game.players.map(player => <IMinifiedPlayer>{
            id: player.id,
            name: player.name,
            status: player.status,
          }),
          name: room.name,
        }
      };
      console.log('tab-closed (non-host room left)');

      otherOnlinePlayerSockets.forEach(e => {
        const clientSocket = socketIO.sockets.sockets.get(e.socketId);
        if (clientSocket) {
          WebsocketCommunication.emitToSocket(clientSocket, RESPONSE_EVENTS.roomLeft, response);
        } else console.log("emit() socket ("+ e.socketId +") is missing! <tab-closed (non-host room left)> <not-an-error>");
      });
    }
  }

  /**
   * 
   * ### A - player aborted is Host
   *  > 1. Delete room from 'rooms' (REDIS).
   *  > 2. Fetch all players from 'identities' (REDIS).
   *  > 3. Broadcast 'room-deleted' event to affected room players.
   *  > 4. Delete + unregister all players connected to the room (host-socket automatically deleted) in 'identities' (delete keys via socketId)
   *  > 5. In front-end, delete identity of affected room players.
   * 
   * Copied from RoomHandler.playerDisconnected()
   */
  private static async _hostAbortion(socketId: string, playerId: string, room: IRoom) {
    console.log(' -- socket', socketId, '  -- player', playerId);
    await redis.hdel('rooms', room.id);

    const otherOnlinePlayers: IPlayer[] = room.game.players.filter(e => e.status == STATUS.online && e.id != playerId);
    console.log('otherOnlinePlayers', otherOnlinePlayers.length);
    const otherOnlinePlayerSockets: IPlayerSocket[] = await GameMapService.fetchSocketIds(otherOnlinePlayers);

    otherOnlinePlayerSockets.forEach(e => {
      const clientSocket = socketIO.sockets.sockets.get(e.socketId);
      if (clientSocket) {
        WebsocketCommunication.emitToSocket(clientSocket, RESPONSE_EVENTS.roomDeleted, null);
      } else console.log("emitToSocket() socket ("+ e.socketId +") is missing! <host-aborted> <not-an-error>");
    });
    RoomService.removeAllSocketsFromRoom(room.id, room.game.players);
  }

  /**
   * When a player goes offline.
   * 
   * 1. Wait 5 seconds ('done!'). ('Now:') Set status = 'offline' in REDIS ('identities') and in 
   *        players-list present in REDIS ('rooms').
   * 2. If player is Host then set 'createdBy' with status = 'offline' in REDIS ('identities'|'rooms').
   * 3. Emit event one by one (because socket no longer exists) to affected room players.
   * 
   * Copied from RoomHandler.playerDisconnected()
   */
  private static async _offlineProcess(socketId: string, identity: IMinifiedIdentity, room: IRoom) {
    identity.player.status = STATUS.offline;

    if (identity.room.createdBy?.id == identity.player.id) {
      identity.room.createdBy.status = STATUS.offline;
    }
    await redis.hset('identities', socketId, JSON.stringify(identity)); // update

    const disconnectedPlayerIndex: number = room.game.players.findIndex(e => e.id == identity.player.id);
    if (disconnectedPlayerIndex != -1) {
      room.game.players[disconnectedPlayerIndex].status = STATUS.offline;

      if (room.createdBy.id == identity.player.id) {
        room.createdBy.status = STATUS.offline;
      }
      await redis.hset("rooms", room.id, JSON.stringify(room)); // update

      const otherOnlinePlayers: IPlayer[] = room.game.players.filter(e => e.status == STATUS.online && e.id != identity.player.id);
      console.log('otherOnlinePlayers', otherOnlinePlayers.length);
      const otherOnlinePlayerSockets: IPlayerSocket[] = await GameMapService.fetchSocketIds(otherOnlinePlayers);
      
      const response: IConnectionUpdatedResponse = {
        players: room.game.players.map(player => <IMinifiedPlayer>{
          id: player.id,
          name: player.name,
          status: player.status,
        }),
      };

      otherOnlinePlayerSockets.forEach(e => {
        const clientSocket = socketIO.sockets.sockets.get(e.socketId);
        if (clientSocket) {
          WebsocketCommunication.emitToSocket(clientSocket, RESPONSE_EVENTS.connectionToggled, response);
        } else console.log("emitToSocket() socket ("+ e.socketId +") is missing! <host-aborted> <not-an-error>");
      });
    } else throw new Error('player not found!');

  }
}