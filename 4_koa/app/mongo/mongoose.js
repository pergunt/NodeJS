const mongoose = require('mongoose'),
  beautyValidation = require('mongoose-beautiful-unique-validation');

mongoose.Promise = Promise;
mongoose.plugin(beautyValidation);

mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
mongoose.set('debug', true);
module.exports = mongoose;
