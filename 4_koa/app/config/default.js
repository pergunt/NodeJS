const defer = require('config/defer').deferConfig;
const path = require('path');

const {
  email: user,
  pass
} = process.env;

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  port: 8080,
  secret:   'mysecret',
  nodemailer: {
    gmail: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user,
        pass,
      }
    }
  },
  mongoose: {
    uri:     process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize:      5
      }
    }
  },
  passport: {
    facebook: {
      appSecret: '86fd3c89558286f060a1c16785c951e2',
      appId: '535687060470235',
      passportOptions: {
        scope:   ['email']
      }
    }
  },
  crypto: {
    hash: {
      length:     128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1
    }
  },
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
  static: defer(cfg => {
    return path.join(cfg.root, 'templates');
  }),
  root:     process.cwd()
};
