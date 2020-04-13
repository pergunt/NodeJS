const Router = require('@koa/router');
const frontPage = require('./frontpage');
const login = require('./login');
const logout = require('./logout');

const router = new Router();

router
  .get('/', frontPage.get)
  .post('/login', login.post)
  .post('/logout', logout.post);

module.exports = router;
