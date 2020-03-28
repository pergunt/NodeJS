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
console.log(handlers);
handlers.forEach(handler => require('./handlers/' + handler).init(app));

// can be split into files too
const Router = require('@koa/router');
const chatRouter = require('./01_ht_chat_koa_rewritten/server');

const router = new Router();

router.get('/views', async function(ctx, next) {
  let count = ctx.session.count || 0;
  ctx.session.count = ++count;

  ctx.body = ctx.render('./templates/index.pug', {
    user: 'John',
    count
  });
});


// параметр ctx.params
// см. различные варианты https://github.com/pillarjs/path-to-regexp
//   - по умолчанию 1 элемент пути, можно много *
//   - по умолчанию обязателен, можно нет ?
//   - уточнение формы параметра через regexp'ы
router.get('/user/:user/hello',
  async (ctx, next) => {
    if (ctx.params.user === 'admin') {
      await next();
      return;
    }

    ctx.throw(403);
  },
  async function(ctx) {
    ctx.body = "Hello, " + ctx.params.user;
  }
);

router.get('/', async function(ctx) {
  // ctx.redirect('/views');

  ctx.body = '1';
});

app.use(router.routes());
app.use(chatRouter.routes());

app.listen(config.get('port'));