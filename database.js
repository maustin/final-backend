let database = new (require('sqlite3')).Database('./database.db');

module.exports = database;