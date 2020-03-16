const express = require('express');
const router = express.Router();

const checkAuth = require('middlewares/checkAuth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET home page. */
router.get('/login', require('./login').get);
router.post('/login', require('./login').post);

router.get('/chat', checkAuth,  require('./chat').get);

router.post('/logout', require('./logout').post);

module.exports = router;
