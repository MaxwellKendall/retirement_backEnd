let rz = require('rhinozug');
let config = require('../config/default');
const knex = require('knex');

module.exports = {
    up: () => {
        let connection = knex(config);
        return connection.schema.hasTable('comments')
            .then((exists) => {
                if (!exists) {
                    return connection.schema.createTable('comments', (table) => {
                        table.increments('id');
                        table.string('author_id');
                        table.string('message');
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
        return connection.schema.dropTable('comments')
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                connection.destroy();
            });
    }
};
