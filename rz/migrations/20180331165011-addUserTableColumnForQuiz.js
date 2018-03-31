'use strict';

let rz = require('rhinozug');
let config = require('../config/default');
const knex = require('knex');

module.exports = {
    up: () => {
        let connection = knex(config);
        return connection.schema.hasTable('users')
            .then((exists) => {
                if (!exists) {
                    return connection.schema.createTable('users', (table) => {
                        table.increments('id');
                        table.string('name');
                        table.string('photoUrl');
                        table.string('google');
                        table.string('facebook');
                        table.string('first');
                    });
                }
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                connection.destroy();
            });
    },
    down: () => {
        let connection = knex(config);
        return connection.schema.dropTable('users')
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                connection.destroy();
            });
    }
};
