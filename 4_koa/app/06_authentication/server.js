const {serveStatic} = require('utils');
const Router = require('@koa/router');
const path = require('path');
const User = require('mongo/models/User').User;
const mongoose = require('mongoose');
const _ = require('lodash');
const passport = require('libs/passport/index.js');

const router = new Router({
  prefix: '/auth'
});


router.get('/', require('./frontpage').get);
router.post('/login', require('./login').post);
router.post('/logout', require('./login').post);

/*
router.get('/', require('./routes/frontpage').get);
router.post('/login', require('./routes/login').post);
router.post('/logout', require('./routes/logout').post);
 */
module.exports = router;
