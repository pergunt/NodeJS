const User = require('mongo/models/User').User;
const passport = require('koa-passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordFields: 'password',
    passReqToCallback: 'true',
  },
  /*
   Три возможых итога функции
    done(null, user[, info]); -> strategy.success(user, info)
    done(null, false[, info]); -> strategy.fail(info)
    done(err); -> strategy.error(err)
   */
  function(req, email, password, done) {
    User.findOne({email}, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'No user found'})
      }
      return done(null, user);
    })
  }
  )
)
