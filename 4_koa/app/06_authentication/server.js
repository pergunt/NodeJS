const Router = require('@koa/router');
const frontPage = require('./frontpage');
const login = require('./login');
const logout = require('./logout');
const registration = require('./registration');
const passport = require('koa-passport');
const config = require('config');

const router = new Router();

router
  .get('/', frontPage.get)
  .get('/signup', registration.get)
  .get('/login/facebook', passport.authenticate('facebook', config.passport.facebook.passportOptions))
  .get('/auth/facebook/callback', async (ctx, next) => {
    console.log('----------------callback')
    await passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true // req.flash
    })(ctx, next)
  })
  .post('/signup', registration.post)
  .post('/login', login.post)
  .post('/logout', logout.post);

module.exports = router;
