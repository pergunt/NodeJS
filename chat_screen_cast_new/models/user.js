const crypto = require('crypto');

const createError = require('http-errors');

const mongoose = require('lib/mongoose'),
  Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};



schema.statics.authorize = function(username, password) {
  const UserModel = this;
  return new Promise((resolve, reject)=> {
    UserModel.findOne({username}, (err, user) => {
      if (err) {
        reject(err);
      } else {
        if (user) {
          if (user.checkPassword(password)) {
            resolve(user);
          } else {
            reject(new createError[403]('Wrong password'))
          }
        } else {
          const user = new UserModel({username, password});
          user.save(err => {
            if (err) return reject(err);
            resolve(user);
          })
        }
      }
    })
  })
}

module.exports = mongoose.model('User', schema);;