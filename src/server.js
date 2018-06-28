const {Server} = require('http');
const RequestsHandler = require('RequestListener');



const requestListener = new RequestsHandler('index.html', new Server(), 'users.json');


const emit = requestListener.server.emit;

requestListener.server.emit = (...rest) => {
	console.log(rest[0]);
	return emit.apply(requestListener.server, rest);
};

module.exports = requestListener;
