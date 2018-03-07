const secrets = require('../secrets');

module.exports = {
  // export configuration object/functions here
  db: {
    client: 'mysql',
    connection: {
      host: `${secrets.host}`,
      user: `${secrets.uname}`,
      password: `${secrets.pwd}`,
      database: `${secrets.db}`,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  googAuth: {
    clientID: `${secrets.googAuth.clientID}`,
    clientSecret: `${secrets.googAuth.clientSecret}`,
    callbackURL: 'http://localhost:9000/auth/google/callback',
  },
  facebookAuth: {
    clientID: `${secrets.facebookAuth.clientID}`,
    clientSecret: `${secrets.facebookAuth.clientSecret}`,
    callbackURL: 'http://localhost:9000/auth/facebook/callback',
  }
};
