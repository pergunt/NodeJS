const mongoose = require('../mongoose'),
  Schema = mongoose.Schema;
const emailValidator = require('email-validator');
const crypto = require('crypto');
const config = require('config');

const userSchema = new Schema({
  name: {
    type: String,
    unique: 'This name had been taken'
  },
  email: {
    type: String,
    unique: 'Somebody already has this email',
    required: [true, 'Email is required!!!11!1'],
    validate: {
      validator: function(email) {
        return emailValidator.validate(email);
      },
      message: props => {
        console.log(props);
        return `${props.value} is not a valid email!`;
      }
    },
  },
  deleted: Boolean,
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    required: true,
    type: String
  },
  parent: {
    ref: 'User',
    type: Schema.Types.ObjectId
  }
}, {
  timestamp: true
});

// userSchema.virtual('children', {
//   ref: 'User',
//   localField: '_id',
//   foreignField: 'parent'
// });

userSchema.virtual('password')
  .set(function (password) {
    if (password && password.length < 4) {
      this.invalidate('password', 'The password length should be greater than 4 chars')
    }
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha1'
      ).toString('base64');
    } else {
      this.salt = null;
      this.passwordHash = null;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password || !this.passwordHash) return false;
  return crypto.pbkdf2Sync(
    password,
    this.salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha1'
  ).toString('base64') === this.passwordHash;
};

userSchema.virtual('fullName')
  .get(function() {
    return this.name + ' ' + this.surname;
  })
  .set(function (value) {
    [this.name, this.surname] = value.trim().split(' ')
  });
userSchema.statics.publickFields = ['name', 'email'];

exports.User = mongoose.model('User', userSchema);

/*
async function createUsers() {
  await User.deleteMany();
  const ivan = new User({
    name: 'Ivan', surname: 'Roskoshnyi'
  });
  const maria = new User({
    name: 'maria',
    surname: 'Boboa',
    parent: ivan
  });

  Promise.all([
    ivan.save(),
    maria.save(),
  ])
    .then(async () => {
      console.log(
        await User.findOne({
          name: 'maria'
        }).populate('children')
      );
      mongoose.disconnect();
    })
    .catch(err => {
      console.log(err);
      mongoose.disconnect();
    })
}*/
