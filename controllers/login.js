const bodyParser = require('body-parser');
const router = require('express').Router();
const passport = require('passport');
const { processRegistration } = require('../auth');
var jsonParser = bodyParser.json();

module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?

  // Login / Logout
  app.get('/login', (req, res, next) => { res.render('login'); });
  app.get('/logout', (req, res) => { req.logout(); res.redirect('/login'); });

  // Google
  app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })); // add scope
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
      res.redirect('/');
    });

  // Facebook
  app.get('/auth/facebook', passport.authenticate('facebook')); // add scope
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
      res.redirect('/');
    });

  // Local Auth
  // (1) Registration
  app.post('/auth/register', jsonParser, (req, res, next) => {
    const { username, password } = req.body;
    processRegistration(username, password)
      .then(user => {
        setTimeout(() => {
          res.send(JSON.stringify({ user }));
        }, 1000)
      })
      .catch(err => console.log('PROCESS REGISTRATION ERROR: ', err))
  });
  // (2) Local Sign in
  app.post('/auth/local', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));
}