const {serveStatic} = require('utils');
const Router = require('@koa/router');
const path = require('path');
const User = require('mongo/models/User').User;
const mongoose = require('mongoose');
const _ = require('lodash');

const router = new Router({
  prefix: '/auth'
});

const getPath = str => path.resolve(__dirname, str);

router.get('/', async ctx => {
  serveStatic(ctx.app, getPath('static'));
  ctx.body = ctx.render(getPath('index.pug'), {
    title: 'Test auth',
  });
});

module.exports = router;
