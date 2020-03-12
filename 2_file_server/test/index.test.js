const server = require('../server');
const fs = require('fs');
const fetch = require('node-fetch');
const assert = require('assert');

describe('server tests', () => {
  before(done => {
    server.listen(3000, done);
  });
  after(done => {
    server.close(done);
  });

  it('should return index.html', (done) => {
    fetch('http://localhost:3000').then(res => res.text())
      .then(body => {
        const file = fs.readFileSync('2_file_server/index.html', {encoding: 'utf-8'});
        assert.equal(body, file);
        done();
      })
      .catch(err => {
        done(err);
        console.log(err.message)
      });
  })
});