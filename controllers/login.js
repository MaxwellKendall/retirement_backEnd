const bodyParser = require('body-parser');
const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook');
const jsonParser = bodyParser.json();
const knex = require('knex');

const config = require('../config');
const db = require('knex')(config.db);

const createNewUser = profile => {
  if (profile.provider === 'google') {
    return db('users')
      .insert({ name: `${profile.name}`, google: `${profile.id}`, photoUrl: `${profile.picture}` });
  } else if (profile.provider === 'facebook') {
    return db('users')
      .insert({ name: `${profile.name}`, facebook: `${profile.id}`, photoUrl: `${profile.picture.data.url}` });
  }
};

const findIdByProviderId = (provider, providerId) => {
  return db.select('id')
    .from('users')
    .where(provider, providerId);
};

const processLogin = (profile) => {
  return new Promise((resolve, reject) => {
    findIdByProviderId(profile.provider, profile.id)
      .then(res => {
        if (res.length === 0) {
          createNewUser(profile)
            .then(resp => {
              console.log('new user : ', { id: resp[0]})
              resolve(resp);
            })
            .catch((err) => {
              console.log('error creating new user: ', err);
              reject(err);
            });
        } else {
          console.log('existing user: ', res[0]);
          resolve(res[0]);
        }
      })
      .catch((err) => {
        console.log('error finding by Provider ID: ', err);
      });
  })
}

module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?

  // Login / Logout
  app.post('/login', jsonParser, (req, res) => {
    const { name, email, picture, id, provider } = req.body;
    processLogin({ name, email, picture, id, provider })
      .then(data => res.send(data))
      .catch(err => console.log('error from processlogin: ', err));
  });
}
