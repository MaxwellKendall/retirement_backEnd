'use strict';
const config = require('../../config');
/* This is the connection information that will be used to run migrations and seeding.  It should be
altered with appropriate information for your needs.  The module needs to export a configuration object
that is accepted by knex, so any of the options available for knex can be set here.  Since this is just
a js file, you can also alter it to bring in config data from process.env or wherever is convenient for
building the connection information */

module.exports = config.db;
