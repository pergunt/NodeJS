
// Usually served by Nginx
const serve = require('koa-static');
const path = require('path');

exports.init = app => {
  app.use(serve('public'));
  app.use(
    serve(
      path.resolve(__dirname, '..', '01_ht_chat_koa_rewritten', 'static')
    )
  );
};
