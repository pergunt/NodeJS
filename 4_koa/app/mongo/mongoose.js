const mongoose = require('mongoose'),
  beautyValidation = require('mongoose-beautiful-unique-validation'),
  config = require('config');

mongoose.Promise = Promise;
mongoose.plugin(beautyValidation);

mongoose.connect(config.get('mongoose').uri, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
mongoose.set('debug', true);

module.exports = mongoose;
