const passport = require('koa-passport');
const User = require('mongo/models/User').User;

require('./serialize');
require('./localStrategy');

module.exports = passport;
