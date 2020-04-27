const passport = require('koa-passport');

require('./serialize');
require('./localStrategy');
require('./facebookStrategy');
require('./facebookTokenStrategy');

module.exports = passport;
