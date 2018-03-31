'use strict';

let rz = require('rhinozug');
let config = require('../config/default');
const knex = require('knex');

module.exports = {
    up: () => {
        let connection = knex(config);
        return connection.schema.hasTable('quiz')
            .then((exists) => {
                if (exists) {
                    return Promise.all([
                        connection('quiz').insert({ name: "first", question_id: "1" }),
                        connection('quiz').insert({ name: "first", question_id: "2" }),
                        connection('quiz').insert({ name: "first", question_id: "3" }),
                        connection('quiz').insert({ name: "first", question_id: "4" }),
                        connection('quiz').insert({ name: "first", question_id: "5" }),
                        connection('quiz').insert({ name: "first", question_id: "6" }),
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
