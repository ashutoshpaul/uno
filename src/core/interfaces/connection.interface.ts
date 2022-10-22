/**
 * Whenever a client connects to a room (client has got playerId and roomId).
 * Used to claim the player by the client on new connection (eg. page refresh).
 * Also, used to remove the player from the room on leave-game event triggered by the player.
 * 
 * REDIS Schema: [{ key: socket.id, value: IConnection }, ...]
 */

export interface IConnection {
    player: {
        playerId: string;
        playerName: string;
    }
    room: {
        roomId: string;
        roomName: string;
    }
}