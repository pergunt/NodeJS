const {Server} = require('http');
const handler = require('handler');

const server = new Server(handler);



const emit = server.emit;
server.emit = (...rest) => {
	console.log(rest[0]);
	return emit.apply(server, rest);
};

module.exports = server;
