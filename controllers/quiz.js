const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const knex = require('knex');

const config = require('../config');
const db = require('knex')(config.db);

const getQuestionsByQuiz = quiz => (
    db.select('question', 'id')
      .from('questions')
      .where('quiz', quiz)
);

const getAnswersById = (ids) => (
  db.select('answer', 'answer_key', 'question_id')
    .from('answers')
    .whereIn('question_id', ids)
)

module.exports = (app) => {
  app.get('/api/quiz', jsonParser, (req, res) => {
    let ids, answers, questions;
    getQuestionsByQuiz('first').then(questions => {
      questions = questions;
      ids = questions.map(question => {
        return question.id
      });
      getAnswersById(ids).then((answers) => {
        answers = answers;
        const responseObject = questions.map(question => {
          return {
            question_id: question.id,
            question: question.question,
            answers: [...answers.filter(answer => answer.question_id === question.id)],
          }
        });
        res.send(responseObject);
      });
    })
  })

  app.post('/api/quiz/results', jsonParser, (req, res) => {
    console.log('quiz results', req.body);
    const { result, id, name } = req.body;
    updateUserScore(result, id, name)
      .then(resp => res.send(resp))
      .catch(err => res.send(err));
  });

}
