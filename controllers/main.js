const bodyParser = require('body-parser');
const router = require('express').Router();
const passport = require('passport');
const { processRegistration } = require('../auth');
var jsonParser = bodyParser.json();

module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?
}