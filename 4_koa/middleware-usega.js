const Koa = require('koa');
const fs = require('fs');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('--> request start', ctx.url);

  let time = Date.now();
  await next();
  time = Date.now() - time;

  console.log('--> request end', time / 1000, 's');
});

app.use(async (ctx, next) => {
  console.log('--> add useful method to ctx');
  ctx.renderFile = async file => {
    await new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          ctx.throw(500);
          reject();
        } else {
          ctx.body = data;
          resolve();
        }
      });
    });
  };
  await next();
});
app.use(async (ctx, next) => {
  console.log('work! Yea work it!');
  if (ctx.url !== '/') {
    ctx.throw(404);
  }
  await ctx.renderFile(__filename);
  console.log('the work is done. The body sent');
});
app.listen(3000, () => console.log('listening on 3000'))
