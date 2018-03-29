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
    .from('answers').whereIn('question_id', ids)
)

module.exports = (app) => {
  app.get('/api/quiz', jsonParser, (req, res) => {
    // Front end needs this
    // const response = [{
    //   question_id: 1,
    //   question: 'Why?',
    //   answers: [{ answer: 'blah', answer_key: 0 }],
    // }];
    let ids, answers, questions;
    getQuestionsByQuiz('first').then(questions => {
      questions = questions;
      ids = questions.map(question => {
        return question.id
      });
      getAnswersById(ids).then((answers) => {
        answers = answers;
        console.log('questions: ', questions);
        console.log('answers: ', answers);
        console.log('ids: ', ids);
        const responseObject = questions.map(question => {
          // take each question object & add new property, that is an array of objects: { question: 'why?', answer_key: 1/0}
          return {
            question_id: question.id,
            question: question.question,
            answers: [...answers.filter(answer => answer.question_id === question.id)],
          }
        });
        console.log('responseObject: ', responseObject);
        res.send(responseObject);
      });
    })
  })
}
