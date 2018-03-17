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

const getComments = (index) => {
 return db.select('users.name', 'users.photoUrl', 'comments.message')
    .from('users', 'comments')
    .join('comments', function(){
      this.on('users.author_id', '=', 'comments.author_id')})
    .limit(index);
}

module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?

  // Add Comment
  app.post('/api/comments', jsonParser, (req, res) => {
    const { author_id, message } = req.body;
    postComment(author_id, message)
      .then(commentId => {
        console.log('postComment response:', commentId);
        res.send('success', commentId);
      })
      .catch(err => console.log('postComment err: ', err));
  })

  app.get('/api/comments', (req, res) => {
    // add code
    const { index } = req.query;
    getComments(index)
      .then(comments => {
        console.log(comments);
        res.send(comments);
      })
  });

  app.delete('/api/comments/:id', jsonParser, (req, res) => {
    // add code
  })
}
