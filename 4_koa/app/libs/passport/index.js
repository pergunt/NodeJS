const passport = require('koa-passport');

require('./serialize');
require('./localStrategy');
require('./facebookStrategy');

module.exports = passport;
