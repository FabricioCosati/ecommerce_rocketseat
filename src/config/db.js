const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: '1802',
    database: 'launchstoredb',
    host: 'localhost',
    port: '5432',
})