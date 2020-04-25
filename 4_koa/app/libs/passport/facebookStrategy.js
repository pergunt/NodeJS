const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const User = require('mongo/models/User').User;
const authenticateByProfile = require('./authenticateByProfile');

function makeProviderId(profile) {
  return profile.provider + ":" + profile.id;
}

passport.use(new FacebookStrategy({
    clientID: config.passport.facebook.appId,
    clientSecret: config.passport.facebook.appSecret,
    passReqToCallback: true,
    profileFields: ['id', 'about', 'email', 'gender', 'link', 'locale', 'timezone', 'name'],
    callbackURL: '/auth/facebook/callback'
  }, (req, accessToken, refreshToken, profile, done) => {
    const p = profile;
    authenticateByProfile(req, profile, done);
  }
));
