const COLUMN_DATA = [];
let database = require('../../database');

// TODO: it appears we can omit the params array.
// Check that this performs correctly.
function readAll(callback) {
	database.get('SELECT * FROM ship_def', callback);
}

function readOne(id, callback) {
	database.get('SELECT * FROM ship_def WHERE id = ?', [id], callback);
}

database.all('PRAGMA table_info(ship_def)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAll, readOne, COLUMN_DATA };