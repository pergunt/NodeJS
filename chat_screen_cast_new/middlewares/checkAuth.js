const createError = require('http-errors');

module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next(new createError[401])
  }
  next();
}