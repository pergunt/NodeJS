// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const config = require('config');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));

// can be split into files too
const Router = require('@koa/router');

const chatRouter = require('./01_ht_chat_koa_rewritten/server');
const usersRouter = require('./05_users_server/server');
const authServer = require('./06_authentication/server');


const router = new Router();

router.get('/views', async function(ctx, next) {
  let count = ctx.session.count || 0;
  ctx.session.count = ++count;

  ctx.body = ctx.render('index.pug', {
    user: 'John',
    count
  });
});

app.use(router.routes());
// app.use(chatRouter.routes());
app.use(usersRouter.routes());
app.use(authServer.routes());

app.listen(config.get('port'));
