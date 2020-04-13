const passport = require('koa-passport');
const User = require('mongo/models/User');

require('./serialize');

require('./localStrategy');

module.exports = passport;
