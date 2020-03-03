const {Server} = require('http');
const fs = require('fs');
const sendFile = require('sendFile');
const url = require('url');

const server = new Server();

const FILES_DIR = __dirname + '/files';

server.on('request', (req, res) => {
  const pathname = decodeURI(url.parse(req.url).pathname);
  const filePath = FILES_DIR + pathname;
  switch (req.method) {
    case 'GET':
      if (pathname === '/') {
        return sendFile(__dirname + '/index.html', res, 'text/html');
      } else {
        res.statusCode = 404;
        return res.end('Wrong url');
      }
    case 'DELETE':
      fs.unlink(filePath, err => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          return res.end('There is no file to be deleted');
        }
        res.statusCode = 200;
        res.end('THe file is deleted');
      });
      break;
    case 'POST':
      const url = pathname.slice(1);
      if (url.includes('/') || !url) {
        res.statusCode = 400;
        res.end('Wrong URL');
        return;
      }
      const file = fs.createWriteStream(filePath, {flags: 'wx'});
      const maxSize = 1024 * 1024;
      let size = '';
      file
        .on('error', err => {
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File already exists');
          } else {
            if (!res.headersSent) {
              res.writeHead(500, 'Connection', 'close');
              res.write('Internal error');
            }
            fs.unlink(filePath, err => {
              res.end();
            });
            console.log(err);
          }
        })
        .on('close', () => {
          res.statusCode = 200;
          res.end('OK');
        })
        .on('open', () => res.setHeader('Content-Type', 'application/octet-stream'));
      req
        .on('data', chunk => {
          size += chunk.length;
          if (size > maxSize) {
            res.statusCode = 413;
            res.setHeader('Connection', 'close');
            res.end(`Resource stream exceeded limit ${size} of ${maxSize}`)
            file.destroy();
            fs.unlink(filePath, err => {
              if (err) {
                console.log(err);
              }
            })
          }
        })
        .on('close', () => {
          file.destroy();
        })
        .pipe(file);

  }
});

server.listen(3000, () => console.log('listening 3000'));