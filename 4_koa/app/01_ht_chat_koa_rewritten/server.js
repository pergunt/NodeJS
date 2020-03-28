// can be split into files too
const Router = require('@koa/router');
const path = require('path');

const router = new Router({
  prefix: '/01_ht_chat_koa_rewritten'
});
const chat = {
  clients: [],
  subscribe(resolve) {
    this.clients.push(resolve);
  },
  publish(message) {
    console.log('publish ' + message);
    this.clients.forEach(resolve => {
      resolve(message);
    });
    this.clients = [];
  }
};
router.get('/', async ctx => {
  ctx.body = ctx.render(path.resolve(__dirname, 'index.pug'))
});
router.get('/subscribe', async (ctx, next) => {
  ctx.set('Cache-Control', 'nocache,must-revalidate');
  const promise = new Promise((resolve, reject) => {
    chat.subscribe(resolve);
    ctx.res.on('close', () => {
      const clients = chat.clients;
      chat.clients = clients.splice(clients.indexOf(resolve), 1);
      const error = new Error('Connection closed');
      error.code = 'ECONNRESET';
      reject(error);
    });
  });
  let msg;
  try {
    msg = await promise;
  } catch (e) {
    if (e.code === 'ECONNRESET') return;
    throw e;
  }
  ctx.body = msg;
});
router.post('/publish',  async ctx => {
    const message = ctx.request.body;
    if (!message) {
      ctx.throw(404);
    }
    chat.publish(message);
  });

module.exports = router;
