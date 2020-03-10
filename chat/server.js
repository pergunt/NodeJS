const {Server} = require('http');
const fs = require('fs');

const chat = {
  clients: [],
  subscribe(req, res) {
    this.clients.push(res);
    res.on('close', () => {
      const clients = this.clients;
      console.log(clients);
      this.clients = clients.splice(clients.indexOf(res), 1);
      console.log(this.clients);
    })
  },
  publish(message) {
    console.log('publish ' + message);
    this.clients.forEach(res => {
      res.end(message)
    });
    this.clients = [];
  }
};
const server = new Server();

server.on('request', (req, res) => {
  switch (req.url) {
    case '/':
      return sendFile(__dirname + '/index.html', res);
    case '/chat':
      return sendFile(__dirname + '/chat.js', res);
    case '/subscribe':
      return chat.subscribe(req, res);
    case '/publish':
      let body = '';
      return req
        .on('readable', () => {
          const data = req.read();
          if (data) {
            body += data;
          }
          if (body.length > 1e4) {
            res.statusCode = 413;
            res.end('your message is too big for my little server');
          }
        })
        .on('end', () => {
          try {
            body = JSON.parse(body);
          } catch (e) {
            res.statusCode = 400;
            return res.end('bad request');
          }
          chat.publish(body.message);
          res.end('ok');
        });
    default:
      res.statusCode = 404;
      res.end('not found');
  }
  function sendFile(fileName, res) {
    const fileStream = fs.createReadStream(fileName);

    fileStream.pipe(res);
    fileStream
      .on('error', () => {
        res.statusCode = 500;
        res.end('Server error')
      });
    res.on('close', () => {
      fileStream.destroy();
    })
  }
});
server.listen(3000, () => console.log('listening 3000'));