let clients = [];

exports.subscribe = function (req, res) {

	clients.push(res);

	res.on('close', function () {
		console.log('closed');

		clients.splice(clients.indexOf(res), 1)
	})
};

exports.publish = function (message) {
	clients.forEach( res => {
		res.end(message)
	});
	clients = [];

};
//setInterval(() => console.log(clients.length), 2000)
