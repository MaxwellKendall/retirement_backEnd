const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const knex = require('knex');
const cors = require('cors');

// Auth
const flash = require('connect-flash');
const { processOAuth, processLocalAuth, processRegistration } = require('./auth');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');

// Defining apis
const mainController = require('./controllers/main');
const loginController = require('./controllers/login');

// Initiating app
const app = express();
var port = process.env.PORT || 9000;
app.set('view engine', 'ejs');

// connecting to dB
const db = knex(config.db);

// setting middleware
app.use(session({ secret: 'SQRLE', resave: false, saveUninitialized: true }));
// app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new FacebookStrategy(config.facebookAuth, processOAuth));
passport.use(new GoogleStrategy(config.googAuth, processOAuth));

// initiating apis
loginController(app);
mainController(app);

app.listen(port);