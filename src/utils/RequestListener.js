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
					this.handlePOST(req, res);
					break;

				case 'DELETE':
					this.handleDELETE(req, res);
					break;
			}
		});
	}
	handlePUT(req, res) {

		fs.readFile(this.outputFile ,{encoding: 'utf-8'},  (err, data) => {
			const currentData = JSON.parse(data);

			RequestListener.writeFile(currentData, res, this.outputFile);
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
	handlePOST(req, res) {
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
				const users = {
					[body.id]: {...body}
				};
				RequestListener.writeFile(users, res, this.outputFile);
			});
	}
	handleDELETE(req, res) {
		let body = '';
		req
			.on('readable', () => {
				const content = req.read();
				if (content) {
					body += content;
				}
			})
			.on('end', () => {
				body = JSON.parse(body);

				fs.readFile(this.outputFile ,{encoding: 'utf-8'},  (err, data) => {
					const currentData = JSON.parse(data);
					delete currentData[body.id];

					RequestListener.writeFile(currentData, res, this.outputFile);
				});
			})
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
