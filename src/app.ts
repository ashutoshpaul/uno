const express = require('express');
import * as dotenv from 'dotenv';
import { WebsocketConfig } from './core/config/websocket.config';
import * as redisSetup from './redis.setup';
import * as websocketSetup from './websocket.setup';

dotenv.config();


const app = express();

const server = app.listen(3000, () => {
  console.log('Started in 3000');
});

const redisClient = redisSetup.setup();

const socketIO = websocketSetup.setup(server);

socketIO.sockets.on('connection', (socket: any) => {
  console.log('connected', socket.id);

  WebsocketConfig.registerEvents(socket);
});

export {redisClient, socketIO };
