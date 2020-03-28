const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  next();
});

app.use((ctx) => {
  ctx.body = {
    res: 'Hello Koa'
  };
});

app.listen(3000);
