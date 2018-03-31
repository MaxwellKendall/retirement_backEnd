const bodyParser = require('body-parser');
const router = require('express').Router();
const jsonParser = bodyParser.json();
const knex = require('knex');
const uuidv1 = require('uuid/v1');

const config = require('../config');
const db = require('knex')(config.db);

const postComment = (userid, msg) => {
  return db('comments')
    .insert({ user_id: `${userid}`, message: `${msg}` })
}

const getCommentsByLimit = (index) => {
 return db.select('users.name', 'users.photoUrl', 'comments.message')
    .from('users', 'comments')
    .join('comments', function(){
      this.on('users.id', '=', 'comments.user_id')})
    .limit(index);
}

module.exports = (app) => {
  app.use(bodyParser.json()); // assumes the requests are coming in JSON
  app.use(bodyParser.urlencoded({ extended: true })); // takes the data from the url and extends it...?

  app.post('/api/comments', jsonParser, (req, res) => {
    const { userid, memory } = req.body;
    postComment(userid, memory)
      .then(commentId => {
        console.log('postComment response:', commentId);
        res.status(200).send(commentId);
      })
      .catch(err => console.log('postComment err: ', err));
  })

  app.get('/api/comments', (req, res) => {
    const { index } = req.query;
    console.log('index: ', index)
    getCommentsByLimit(index)
      .then(comments => {
        console.log(comments);
        res.send(comments);
      })
  });

  app.delete('/api/comments/:id', jsonParser, (req, res) => {
    // add code
  })
}
