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
/*
UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
          'facebookProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
            var newUser = new that({
                  email: profile.emails[0].value,
                  facebookProvider: {
                        id: profile.id,
                        token: accessToken
                  }
            });

            newUser.save(function(error, savedUser) {
              if (error) {
                    console.log(error);
              }
              return cb(error, savedUser);
        });
      } else {
            return cb(err, user);
      }
    });
  };
 */
