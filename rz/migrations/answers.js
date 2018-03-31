'use strict';

let rz = require('rhinozug');
let config = require('../config/default');
const knex = require('knex');

module.exports = {
    up: () => {
        let connection = knex(config);
        return connection.schema.hasTable('answers')
            .then((exists) => {
                if (exists) {
                    return Promise.all([
                        connection('answers').insert({ body: "Gardener, Mass", question_id: "1", answer_key: 1 }),
                        connection('answers').insert({ body: "Atlanta, GA", question_id: "1", answer_key: 0 }),
                        connection('answers').insert({ body: "DC", question_id: "1", answer_key: 0 }),
                        connection('answers').insert({ body: "Canada", question_id: "1", answer_key: 0 }),

                        connection('answers').insert({ body: "RedSox baby!!", question_id: "2", answer_key: 1 }),
                        connection('answers').insert({ body: "New York Yankees", question_id: "2", answer_key: 0 }),
                        connection('answers').insert({ body: "Washington Nats", question_id: "2", answer_key: 0 }),
                        connection('answers').insert({ body: "Atlanta Braves", question_id: "2", answer_key: 0 }),

                        connection('answers').insert({ body: "Real Old", question_id: "3", answer_key: 1 }),
                        connection('answers').insert({ body: "70", question_id: "3", answer_key: 0 }),
                        connection('answers').insert({ body: "56", question_id: "3", answer_key: 0 }),
                        connection('answers').insert({ body: "Old Enough to Retire", question_id: "3", answer_key: 0 }),

                        connection('answers').insert({ body: "Never", question_id: "4", answer_key: 1 }),
                        connection('answers').insert({ body: "This morning", question_id: "4", answer_key: 0 }),
                        connection('answers').insert({ body: "20 Years ago", question_id: "4", answer_key: 0 }),
                        connection('answers').insert({ body: "Every time I see him", question_id: "4", answer_key: 0 }),

                        connection('answers').insert({ body: "From protecting a woman in a bar", question_id: "5", answer_key: 1 }),
                        connection('answers').insert({ body: "Falling down ice-skating", question_id: "5", answer_key: 0 }),
                        connection('answers').insert({ body: "Giving CPR to someone who needed it", question_id: "5", answer_key: 0 }),
                        connection('answers').insert({ body: "After house fire", question_id: "5", answer_key: 0 }),

                        connection('answers').insert({ body: "Parker", question_id: "6", answer_key: 1 }),
                        connection('answers').insert({ body: "Nelson", question_id: "6", answer_key: 0 }),
                        connection('answers').insert({ body: "Andy", question_id: "6", answer_key: 0 }),
                        connection('answers').insert({ body: "George", question_id: "6", answer_key: 0 }),
                    ])
                        .then(() => {
                            connection.destroy();
                        }).catch((err) => {
                            connection.destroy();
                        });
                }
            });
    },
    // seeds only run up for now, but making them downable is not inconceivable
    down: () => { }
};
