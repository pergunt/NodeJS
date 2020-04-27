const serve = require('koa-static');

function serveStatic(app, path) {
  app.use(
    serve(path)
  );
};
function makeProviderId(profile) {
  return profile.provider + ":" + profile.id;
}

module.exports = {
  makeProviderId,
  serveStatic
};
