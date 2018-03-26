'use strict';

let rz = require('rhinozug');
let config = require('../config/default');
const knex = require('knex');

module.exports = {
    up: () => {
        let connection = knex(config);
        return connection.schema.hasTable('users')
            .then((exists) => {
                if (exists) {
                    return Promise.all([
                        connection('comments').insert({id: 1, user_id: 1, message: 'comment1 from user 1'}),
                        connection('comments').insert({id: 2, user_id: 1, message: 'comment2 from user 1'}),
                        connection('comments').insert({id: 3, user_id: 1, message: 'comment3 from user 1'}),
                        connection('comments').insert({ id: 4, user_id: 1, message: 'comment4 from user 1' }),
                        connection('comments').insert({ id: 5, user_id: 1, message: 'comment5 from user 1' }),
                        connection('comments').insert({ id: 6, user_id: 2, message: 'comment1 from user 2' }),
                        connection('comments').insert({ id: 7, user_id: 2, message: 'comment2 from user 2' }),
                        connection('comments').insert({ id: 8, user_id: 2, message: 'comment3 from user 2' }),
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
    down: () => {}
};
