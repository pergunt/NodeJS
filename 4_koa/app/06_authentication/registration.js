const passport = require('koa-passport');
const User = require('mongo/models/User').User;
const pick = require('lodash/pick');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('./emailsender').sendMail

exports.get = async function(ctx, next) {
	ctx.body = ctx.render('registration');
};

exports.post = async function(ctx, next) {
	const token = uuidv4();
	ctx.request.body.token = token;
	const user = await User.create(pick(ctx.request.body, ['email', 'password', 'token']));
	// ctx.flash('error', 'message');
	// ctx.redirect('/registration');
	const link = `http://localhost:8080/verify${token}`;
	const email = user.email;
	const displayName = user.displayName || 'Default Display Name';
	const htmlFile = ctx.render('emailVerify', {
		link
	});
	await sendMail({
		ctx,
		link,
		message: 'Verify your email',
		htmlFile
	})
	await ctx.login(user);
	ctx.redirect('/waitverify');
};
exports.verifyToken = async (ctx, next) => {
	const token = ctx.params.token;
	let user = await User.findOne({token});

	if (!user) {
		ctx.throw(404);
	}
	user.confirmedEmail = true;
	user = await user.save();
	await ctx.login(user);
	ctx.redirect('/');
}
