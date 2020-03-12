
const mongoose = require('lib/mongoose');

const mongooseConnection = mongoose.connection;

// user.save((err, user, affected) => {
//   console.log(err, user);
//
//   User.findOne({username: 'Ivan'}, (err, ivan) => {
//     console.log(ivan);
//   })
// });
const open = () => mongooseConnection.once('open', () => console.log('connection open'));
const dropDB = () => mongooseConnection.db.dropDatabase();
const disconnect = () => mongoose.disconnect();

const requireModels = async () => {
  require('models/user');
  const models = mongoose.models;
  for (let model of Object.values(models)) {
    await model.ensureIndexes();
  }
};
const createUsers = async () => {
  const users = [
    {
      username: 'Ivan',
      password: 'secret'
    },
    {
      username: 'yurii',
      password: 'secret'
    },
    {
      username: 'Bob',
      password: 'secret'
    }
  ];
  try {
    const models = mongoose.models;
    for(const item of users) {
      const user = new models.User(item);
      await user.save();
    }
    console.log('users are successfully created')
    return mongoose.models.User.findOne({username: 'Ivan'}, (err, ivan) => {
      console.log(err, ivan);
    });
  } catch (e) {
    throw e;
  }

};

const series = async () => {
  await open();
  await dropDB();
  await requireModels();
  await createUsers();
  console.log('done');
};
series()
  .catch(err => {
    console.log(err)
    disconnect();
    process.exit(255);
  });
