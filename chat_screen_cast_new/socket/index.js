const io = require('socket.io');
module.exports = server => {
  const socketServer = io(server, {
    origins: 'localhost:*'
  });
  socketServer.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('message', function(msg, fn){
      socket.broadcast.emit('message', msg);
      fn(msg);
      console.log('message: ', msg);
    });
  });
}
