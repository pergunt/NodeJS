// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const https = require('https');
const app = new Koa();

const config = require('config');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
handlers.forEach(handler => require('./middlewares/' + handler).init(app));

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

// app.use(router.routes());
// app.use(chatRouter.routes());
// app.use(usersRouter.routes());
app.use(authServer.routes());

// app.listen(config.get('port'));
const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
};

https.createServer(options, app.callback()).listen(config.get('port'), () => {
  console.log('Listening at', config.get('port'));
});
