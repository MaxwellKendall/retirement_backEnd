'use strict';

let rz = require('rhinozug');
let config = require('../config/default');
const knex = require('knex');

module.exports = {
    up: () => {
        let connection = knex(config);
        return connection.schema.hasTable('questions')
            .then((exists) => {
                if (exists) {
                    return Promise.all([
                        connection('questions').insert({ body: "Where was Ross born?", quiz: "first" }),
                        connection('questions').insert({ body: "What is Ross's favorite baseball team?", quiz: "first" }),
                        connection('questions').insert({ body: "How old is Ross?", quiz: "first" }),
                        connection('questions').insert({ body: "When was the last time Ross had a fight?", quiz: "first" }),
                        connection('questions').insert({ body: "When was the only time Ross rode in an ambulance?", quiz: "first" }),
                        connection('questions').insert({ body: "What is Ross's middle name?", quiz: "first" }),
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
