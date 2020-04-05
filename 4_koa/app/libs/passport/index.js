const passport = require('koa-passport');
const User = require('mongo/mogels/User').User;

require('./serialize');
require('./localStrategy');

module.exports = passport;