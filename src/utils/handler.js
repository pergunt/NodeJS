const fs = require('fs');


module.exports = function(req, res) {
	if (req.method === 'GET') {
        const stream = new fs.ReadStream('index.html', {encoding: 'utf-8'});
		stream.on('readable', function () {
			const data = stream.read();
            res.end(data)
        });
	} else {
        res.end(JSON.stringify('Method should be a GET'))
	}
};