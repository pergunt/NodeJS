const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const User = require('mongo/models/User').User;
const authenticateByProfile = require('./authenticateByProfile');

passport.use(new FacebookStrategy({
    clientID: config.passport.facebook.appId,
    clientSecret: config.passport.facebook.appSecret,
    passReqToCallback: true,
    profileFields: ['id', 'picture', 'about', 'email', 'gender', 'link', 'locale', 'timezone', 'name'],
    callbackURL: '/auth/facebook/callback'
  }, (req, accessToken, refreshToken, profile, done) => {
    const p = profile;
    console.log(accessToken);
    authenticateByProfile(req, profile, done);
  }
));
