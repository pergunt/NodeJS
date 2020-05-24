const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook-token');
const config = require('config');
const User = require('mongo/models/User').User;
const {makeProviderId} = require('utils');
const authenticateByProfile = require('./authenticateByProfile');

passport.use(new FacebookStrategy({
    clientID: config.passport.facebook.appId,
    clientSecret: config.passport.facebook.appSecret,
    passReqToCallback: true,
    profileFields: ['email', 'name'],
  }, (req, accessToken, refreshToken, profile, done) => {
    const p = profile;
    console.log(accessToken);
    authenticateByProfile(req, profile, done);
  }
));
