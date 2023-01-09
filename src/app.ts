const express = require('express');
const bodyParser = require('body-parser');
import cors from "cors";
import * as dotenv from 'dotenv';
import * as redisSetup from './redis.setup';
import * as websocketSetup from './websocket.setup';
import * as routeSetup from './route.setup';
import { Server, Socket } from 'socket.io';
import { RESPONSE_EVENTS } from './core/enums/response-events.enum';
import { WebsocketListeners } from "./core/websocket/communication/websocket.listners";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = app.listen(3000, () => {
  console.log('Started in 3000');
});

const redisClient = redisSetup.setup();

const socketIO: Server = websocketSetup.setup(server);

routeSetup.setup(app);

socketIO.sockets.on('connection', (socket: Socket) => {
  console.log('connected', socket.id);

  socket.emit(RESPONSE_EVENTS.connectionEstablished, socket.id);

  WebsocketListeners.registerListnerEvents(socket);
});

export {redisClient, socketIO };


// ngrok tcp 3000
// ngrok http 3000 (don't use this one)