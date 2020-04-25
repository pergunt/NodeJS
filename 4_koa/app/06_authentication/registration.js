const passport = require('koa-passport');
const User = require('mongo/models/User').User;
const pick = require('lodash/pick');

exports.get = async function(ctx, next) {
	ctx.body = ctx.render('registration');
};

exports.post = async function(ctx, next) {
	const user = await User.create(pick(ctx.request.body, ['email', 'password']));
	console.log(user);
	// ctx.flash('error', 'message');
	// ctx.redirect('/registration');
	await ctx.login(user);
	ctx.redirect('/');
};
