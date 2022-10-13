/**
 * @Author: Ashutosh 
 * @Date:   2022-08-30 02:05:12
 * @Last Modified by:   Ashutosh 
 * @Last Modified time: 2022-08-30 04:15:25
 */

console.log("hello");

const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(3000, () => {
  console.log('Started in 3000');
});

const io = socket(server);

let count: number = 0;

io.sockets.on('connection', (socket: any) => {
  console.log('connected')
  socket.emit('updatecount',count)
  
  socket.on('increment', () => {
    count++;
    io.emit('updatecount',count);
  });
  
  socket.on('disconnect', () => {
    console.log('server disconnected');
  });
});