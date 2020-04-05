const User = require('mongo/mogels/User').User
const passport = require('koa-passport');

passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser((email, done) => {
  User.findOne({email}, done)
});