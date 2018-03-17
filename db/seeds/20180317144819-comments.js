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
                        connection('comments').insert({id: 1, author_id: '7a0b5b40-29ee-11e8-a3e2-f38683f15714', message: 'comment1 from user 7a'}),
                        connection('comments').insert({id: 2, author_id: '7a0b5b40-29ee-11e8-a3e2-f38683f15714', message: 'comment2 from user 7a'}),
                        connection('comments').insert({id: 3, author_id: '7a0b5b40-29ee-11e8-a3e2-f38683f15714', message: 'comment3 from user 7a'}),
                        connection('comments').insert({ id: 4, author_id: '7a0b5b40-29ee-11e8-a3e2-f38683f15714', message: 'comment4 from user 7a' }),
                        connection('comments').insert({ id: 5, author_id: '7a0b5b40-29ee-11e8-a3e2-f38683f15714', message: 'comment5 from user 7a' }),
                        connection('comments').insert({ id: 6, author_id: '7b1d4070-29ee-11e8-a3e2-f38683f15714', message: 'comment1 from user 7b' }),
                        connection('comments').insert({ id: 7, author_id: '7b1d4070-29ee-11e8-a3e2-f38683f15714', message: 'comment2 from user 7b' }),
                        connection('comments').insert({ id: 8, author_id: '7b1d4070-29ee-11e8-a3e2-f38683f15714', message: 'comment3 from user 7b' }),
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
