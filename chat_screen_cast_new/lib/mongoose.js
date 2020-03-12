const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('mongoose:url'), config.get('mongoose:options'));
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
mongoose.set('debug', true);
module.exports = mongoose;
