let database = new (require('sqlite3')).Database('./database.db');

// database is the lonliest module.

module.exports = database;