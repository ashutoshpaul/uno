const socket = require('socket.io');

function setup(server: any): any {
  try {
    const io = socket(server, {
      cors: { origin: '*' }
    });
    return io;
  } catch(e) {
    throw new Error('Socket not connected!');
  }
}

export { setup };