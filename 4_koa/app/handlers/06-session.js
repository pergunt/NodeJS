// in-memory store by default (use the right module instead)
const session = require('koa-generic-session');
const convert = require('koa-convert');
const mongooseStore = require('koa-session-mongoose');

// sadfhawlufey49fawhfa, sid

/*
const sessions = {
  sadfhawlufey49fawhfa: { name: "Ivan", visitsCount: 1 }
};

if (ctx.cookie.sid && sessions[ctx.cookie.sid])
  ctx.session = sessions[ctx.cookie.sid];
*/

exports.init = app => app.use(convert(session({
  key: 'sid',
  cookie: {
    httpOnly: true,
    path: '/',
    overwrite: true,
    signed: false,
    maxAge: 3600 * 4 * 1e3
  },
  rolling: true,
  store: mongooseStore.create({
    model: 'Session',
    expires: 3600 * 4
  })
})));
