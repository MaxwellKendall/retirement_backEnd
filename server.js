/**
 * TODOS: Set up session storage in secure way
 */

const express = require('express');
const mysql = require('mysql');
const session = require('cookie-session');
const helmet = require('helmet');
const knex = require('knex');

const config = require('./config');

// Defining apis
const mainController = require('./controllers/main');
const loginController = require('./controllers/login');
const commentsController = require('./controllers/comments');

// Initiating app
const app = express();
var port = process.env.PORT || 9001;
app.set('view engine', 'ejs');

// connecting to dB
const db = knex(config.db);

// setting middleware
app.use(session({ secret: 'SQRLE', resave: false, saveUninitialized: true }));
app.use(helmet());
app.disable('x-powered-by');

// initiating apis
loginController(app);
mainController(app);
commentsController(app);

app.listen(port);