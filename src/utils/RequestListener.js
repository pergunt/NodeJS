const fs = require('fs');
const errorHandler = require('errorHandler');
const mapToArr = require('mapToArr');

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

				case 'PUT':

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
	handlePOST(req, res) {

        RequestListener.readRequestBody(req, requestBody => {

            this.readFile( data => {

            	const exists = mapToArr(data).filter( user => user.id === requestBody.id);
				if (exists.length) {
					console.log('reading--------------', exists,'-----');
                    return res.end('user already exists!')
				}
                const users = {
                    [requestBody.id]: {...requestBody}
                };
                RequestListener.writeFile({...users, ...data}, res, this.outputFile);
            })
        });
	}
	handleDELETE(req, res) {
		RequestListener.readRequestBody(req, body => {
			this.readFile(body, res, data => {
				const currentData = JSON.parse(data);
				delete currentData[body.id];
				RequestListener.writeFile(currentData, res, this.outputFile);
			})
		});
	}
	readFile(func) {
        fs.readFile(this.outputFile ,{encoding: 'utf-8'},  (err, json) => {
			const data = json ? JSON.parse(json) : {};
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
                RequestListener.handleError(err, res);
			} else {
				res.statusCode = 200;
				res.end('ok');
			}
		});
	}
	static handleError(error, res) {
        res.statusCode = 500;
        res.end(error.message || 'Server error');
    }

}

module.exports = RequestListener;
