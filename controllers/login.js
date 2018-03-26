const bodyParser = require('body-parser');
const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook');
const jsonParser = bodyParser.json();
const knex = require('knex');
const uuidv1 = require('uuid/v1');

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
              // console.log('new user : ', { id: resp[0]});
              const userId = resp[0];
              resolve(userId);
            })
            .catch((err) => {
              console.log('error creating new user: ', err);
              reject(err);
            });
        } else {
          console.log('existing user: ', res[0].id);
          resolve(res[0].id);
        }
      })
      .catch((err) => {
        console.log('error finding by Provider ID: ', err);
      });
  })
}

const getProfile = (userId) => {
  return db.select().from('users').where('id', userId);
}

module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?

  // Login / Logout
  app.post('/login', jsonParser, (req, res) => {
    console.log('***SESSSION: ', req.session);
    const { name, email, picture, id, provider } = req.body;
    processLogin({ name, email, picture, id, provider })
      .then((userId) => {
        getProfile(userId).then(profile => {
          console.log('profile: ', profile);
          req.session.user = profile[0].id;
          res.send({ name: profile[0].name, photoUrl: profile[0].photoUrl });
        });
      })
      .catch(err => console.log('error from processlogin: ', err));
  });
}
