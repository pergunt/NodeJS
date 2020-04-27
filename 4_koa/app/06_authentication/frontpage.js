const User = require('mongo/models/User').User;

exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) {
    const {user: {providers}} = ctx.state;
    const provider = providers.find(({profile}) => profile.provider === 'facebook');
    if (provider) {
      ctx.body = ctx.render('welcome', {
        photos: provider.profile.photos
      });
    } else {
      ctx.body = ctx.render('welcome');
    }
  } else {
    ctx.body = ctx.render('login');
  }
};
