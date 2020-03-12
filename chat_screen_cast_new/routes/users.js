const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;

const User = require('models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, (err, users) => {
    if (err) return next(err);
    res.json(users)
  });
});
router.get('/:id', (req, res, next) => {
  let id;
  try {
    id = new ObjectID(req.params.id);
  } catch (e) {
    return next(new createError[400](e));
  }
  User.findById(id, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return next(new createError[404](err));
    }
    res.json(user)
  })
})

module.exports = router;
