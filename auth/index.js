// however you auth, logic can go here
'use strict';
const passport = require('passport');
const config = require('../config'); // add config for auth
const db = require('knex')(config.db);
const uuidv = require('uuid/v1');

// DB Insert/Update Statements
// 1.
const createNewUser = profile => {
  if (profile.provider === 'google') {
    return db('users')
      .insert({ name: `${profile.displayName}`, google: `${profile.id}`, photoUrl: `${profile._json.image.url}` });
  } else if (profile.provider === 'facebook') {
    return db('users')
      .insert({ name: `${profile.displayName}`, facebook: `${profile.id}` });
  }
};

// 2.
const providerSpecificUpdate = (id, profile) => {
  if (profile.provider === 'google') {
    return db('users')
      .where('id', id)
      .update({ 'google': `${profile.id}`, 'photoUrl': `${profile._json.image.url}` });
  } else {
    return db('users')
      .where('id', id)
      .update({ 'goodreads': `${profile.id}` });
  }
};

// DB Select Statements
// 1. 
const findIdByProviderId = (provider, providerId) => {
  return db.select('id')
    .from('users')
    .where(provider, providerId);
};
// 2. 
const checkCredentials = (username, password = null) => {
  if (password !== null) {
    return db.select('id')
      .from('users')
      .where({ 'password': password, 'username': username });
  } else if (password === null) {
    return db.select('id')
      .from('users')
      .where({ 'username': username });
  }
}

// Processing logic
// 1.
const processOAuth = (req, token, tokenSecret, profile, done) => {
  const provider = profile.provider;
  if (!req.user) {
    // req.user is defined if user is logged in.
    passport.serializeUser((user, done) => {
      // update the req object on user property with userid
      done(null, user);
    });
    // 
    passport.deserializeUser((id, done) => {
      // take whats on the stream and convert to an object...? Used to check DB prior to doing this for some reason...?
      done(null, id);
    });
    findIdByProviderId(profile.provider, profile.id)
      // based on provider (google or good reads) check to see if user exists yet
      .then(result => {
        if (result.length !== 0) {
          done(null, result[0].id);
        } else {
          createNewUser(profile)
            .then(newUser => {
              done(null, newUser[0]);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  } else {
    // handles case when user is logged in but authroization is occurring because they're connecting their accounts
    providerSpecificUpdate(req.user, profile)
      .then(res => {
        done(null, req.user);
      })
      .catch(err => console.log(err));
  }
};

// 2.
const processLocalAuth = (username, password, done) => {
  checkCredentials(username, password)
    .then(res => {
      passport.serializeUser((user, done) => {
        done(null, user);
      });
      passport.deserializeUser((id, done) => {
        done(null, id);
      });
      done(null, res[0].id);
    })
    .catch(err => console.log('Local Login failed. checkSignIn Error: ', err));
};

// 3.
const processRegistration = (username, password) => {
  // validate password in front end; using string.prototype.match(regexpression in string form);
  return new Promise((resolve, reject) => {
    checkCredentials(username)
      .then(resp1 => {
        if (resp1.length === 0) {
          createNewUser({ username, password, provider: 'local' })
            .then(resp2 => {
              resolve({ id: resp2[0], username, password });
            })
            .catch(err => console.log('error on createNewUser ', err));
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.log('ERROR ProcessRegistration(): ', err);
        resolve(false);
      });
  })
};

module.exports = {
  processOAuth,
  processLocalAuth,
  processRegistration,
}
