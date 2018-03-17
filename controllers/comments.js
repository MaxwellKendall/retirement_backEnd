const bodyParser = require('body-parser');
const router = require('express').Router();
const jsonParser = bodyParser.json();
const knex = require('knex');
const uuidv1 = require('uuid/v1');

const config = require('../config');
const db = require('knex')(config.db);

const postComment = (auth, msg) => {
  return db('comments')
    .insert({ author_id: `${auth}`, message: `${msg}` })
}
module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?

  // Add Comment
  app.post('/api/comments', jsonParser, (req, res) => {
    const { author_id, message } = req.body;
    postComment(author_id, message)
      .then(postCommentRes => {
        console.log('postComment response:', postCommentRes);
        res.send('success');
      })
      .catch(err => console.log('postComment err: ', err));
  })
  app.get('/api/comments', jsonParser, (req, res) => {
    // add code
  })
  app.delete('/api/comments/:id', jsonParser, (req, res) => {
    // add code
  })
}
