const {Server} = require('http');
const util = require('util');

const obj = {
  a: 1,
};
console.log(util.inspect(obj));


const server = new Server();
const emit = server.emit;

server.emit = (...args) => {
  console.log(args[0]);
  return emit.apply(server, args);
};
server.listen(8008);

