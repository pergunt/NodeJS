// no templates in ctx example
const pug = require('pug');
const path = require('path')

exports.init = app => app.use(async (ctx, next) => {
  // in the future we'll extend this
  ctx.render = function(templateName, locals) {
    const template = path.resolve(__dirname, '..', `templates`, `${templateName}.pug`);
    return pug.renderFile(template, locals);
  };

  await next();
});
