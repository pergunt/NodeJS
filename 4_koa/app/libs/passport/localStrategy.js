let passport = require('koa-passport');
let LocalStrategy = require('passport-local');
let User = require('mongo/models/User').User;

// Стратегия берёт поля из req.body
// Вызывает для них функцию
passport.use(new LocalStrategy({
    usernameField: 'email', // 'username' by default
    passwordField: 'password',
    passReqToCallback: true, // req for more complex cases
  },
  // Три возможных итога функции
  // done(null, user[, info]) ->
  //   strategy.success(user, info)
  // done(null, false[, info]) ->
  //   strategy.fail(info)
  // done(err) ->
  //   strategy.error(err)

  // TODO: rewrite this, use async/await
  function(req, email, password, done) {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.confirmedEmail || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }
      return done(null, user);
    });
  }
));
