const fs = require('fs');
const errorHandler = require('errorHandler');


class RequestListener {
	constructor(initFileName, server, outputFile) {
		this.fileName = initFileName;
		this.server = server;
		this.outputFile = outputFile;

		this.server.on('request', (req, res) => {
			switch (req.method) {
				case 'GET':
					this.handleGET(req, res);
					break;

				case 'POST':
					this.fileManaging(req, res);
					break;

				case 'DELETE':
					this.fileManaging(req, res);
					break;
			}
		});
	}

	handleGET(req, res) {
		const file = new fs.ReadStream(this.fileName, {encoding: 'utf-8'});
		file.pipe(res);
		file
			.on('error', function(err) {
				errorHandler(err, res);
			})
			.on('close', function() {
				console.log('file is successfully closed')
			});
		res.on('close', function () {
			file.destroy();
			console.log('connection is closed')
		});
	}
	fileManaging(req, res) {

		RequestListener.readRequestBody(req, body => {
			if (req.method === 'POST') {

				this.readFile(body, res, data => {
					const users = {
						[body.id]: {...body}
					};

					RequestListener.writeFile({...users, ...JSON.parse(data)}, res, this.outputFile);
				})

			} else {

				this.readFile(body, res, data => {
					const currentData = JSON.parse(data);
					delete currentData[body.id];

					RequestListener.writeFile(currentData, res, this.outputFile);
				})

			}
		});

	}
	readFile(body, res, func) {
		fs.readFile(this.outputFile ,{encoding: 'utf-8'},  (err, data) => {
			func(data)
		});
	}
	static readRequestBody(req, func) {
		let body = '';
		req
			.on('readable', () => {
				const content = req.read();
				if (content) {
					body += content
				}
			})
			.on('end', () => {
				body = JSON.parse(body);
				func(body)
			});
	}
	static writeFile(content, res, outputFile) {
		fs.writeFile(outputFile, JSON.stringify(content), function (err) {
			if (err) {
				errorHandler(err, res);
			} else {
				res.statusCode = 200;
				res.end('ok')
			}
		});
	}
}

module.exports = RequestListener;
