const serve = require('koa-static');

exports.serveStatic = (app, path) => {
  app.use(
    serve(path)
  );
};
