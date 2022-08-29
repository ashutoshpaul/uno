/**
 * @Author: Ashutosh 
 * @Date:   2022-08-30 02:05:12
 * @Last Modified by:   Ashutosh 
 * @Last Modified time: 2022-08-30 02:21:11
 */

console.log("hello");

const http = require('http');
const express = require('express');

const app = express()
const server = http.createServer(http);

const socketio = require('socket.io')
const io = socketio(server)

let count = 0 ; // count global variable 

io.on('connection', (socket: any) => {
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

server.listen(3000, () => {
  console.log('server started');
});