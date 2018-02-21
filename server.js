const express = require('express');
// const mongoose = require('mongoose'); // see comment on line 10
const session = require('express-session');
const app = express();
// const config = require('./config'); // see comment on line 10

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

/*
 * go to config file to make function return connection string
 * mongoose.connect(config.getDbConnectionString());
 */

 app.use('/', express.static(`${__dirname}/public`));
app.use(session({ secret: '12345', resave: false, saveUninitialized: true }));

app.listen(port);
