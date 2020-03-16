const User = require('models/user');

exports.get = (req, res) => {
  res.render('login')
};

exports.post = (req, res, next) => {
  const {username, password} = req.body;

  User.authorize(
    username,
    password
  )
    .then(user => {
      req.session.user = user._id;
      res.send({})
    })
    .catch(err => next(err));
};