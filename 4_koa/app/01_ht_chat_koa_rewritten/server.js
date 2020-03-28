// can be split into files too
const Router = require('@koa/router');
const path = require('path');

const router = new Router({
  prefix: '/01_ht_chat_koa_rewritten'
});
const chat = {
  clients: [],
  subscribe(ctx) {
    this.clients.push(ctx);
    ctx.res.on('close', () => {
      const clients = this.clients;
      this.clients = clients.splice(clients.indexOf(ctx), 1);
      console.log(this.clients);
    })
  },
  publish(message) {
    console.log('publish ' + message);
    this.clients.forEach(ctx => {
      ctx.body = message;
    });
    this.clients = [];
  }
};
router.get('/', async ctx => {
  ctx.body = ctx.render(path.resolve(__dirname, 'index.pug'))
})
  .get('/subscribe', async (ctx, next) => {
    chat.subscribe(ctx);
    await next();
  })
  .use(async ctx => {
    await new Promise(resolve => {
      if (ctx.body) {
        chat.publish(ctx.body);
        resolve();
      }
    })
  });

module.exports = router;
