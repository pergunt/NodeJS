const fs = require('fs');

function sendFile(fileName, res, mimeType) {
  const fileStream = fs.createReadStream(fileName);

  fileStream
    .on('error', err => {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File is not found');
        return
      }
      res.statusCode = 500;
      res.end('Server error')
    })
    .on('open', () => res.setHeader('Content-Type', mimeType))
    .pipe(res);
  res.on('close', () => {
    fileStream.destroy();
  })
}
module.exports = sendFile;
