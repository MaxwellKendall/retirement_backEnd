/**
 * TODOS: Set up session storage in secure way
 */

const express = require('express');
const mysql = require('mysql');
const session = require('cookie-session');
const helmet = require('helmet');
const knex = require('knex');
const uuidv1 = require('uuid/v1')
const config = require('./config');

// Defining apis
const mainController = require('./controllers/main');
const loginController = require('./controllers/login');
const commentsController = require('./controllers/comments');
const quizController = require('./controllers/quiz');

// Initiating app
const app = express();
var port = process.env.PORT || 9001;
app.set('view engine', 'ejs');

// connecting to dB
const db = knex(config.db);

// setting secure sessions
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(helmet());
app.disable('x-powered-by');
app.use(session({
    resave: false,
    saveUninitialized: true,
    name: 'retirementCookie',
    secret: `${uuidv1()}`,
    cookie: {
      secure: false,
      httpOnly: true,
      expires: expiryDate,
      domain: 'localhost:9000',
      path: '/',
    }
  }
));

// initiating apis
loginController(app);
mainController(app);
commentsController(app);
quizController(app);
app.get('/*', (req, res) => {
  res.render('index');
})

app.listen(port);