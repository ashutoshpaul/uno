const express = require('express');
import * as dotenv from 'dotenv';
import * as redisSetup from './redis.setup';
import * as websocketSetup from './websocket.setup';

dotenv.config();


const app = express();

const server = app.listen(3000, () => {
  console.log('Started in 3000');
});


// REDIS
let redisClient = redisSetup.setup();
// console.log('redisClient', redisClient);


// SOCKET
const io = websocketSetup.setup(server);
// console.log('io', io);


let count: number = 0;

io.sockets.on('connection', (socket: any) => {
  console.log('connected', socket.id);

  socket.on('increment', () => {
    count++; console.log('--------- INC', count);
    io.emit('increment-count', count);
  });

  socket.on('decrement', () => {
    count--; console.log('--------- DEC', count);
    io.emit('decrement-count', count);
  });

  socket.on('disconnect', () => {
    console.log('server disconnected');
  });
});