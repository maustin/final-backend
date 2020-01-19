const COLUMN_DATA = [];
let database = require('../../database');

function readAll(callback) {
	console.log('manufacturer readAll');
	database.all('SELECT * FROM manufacturer', callback);
}

function readOne(id, callback) {
	console.log('manufacturer readOne');
	database.get('SELECT * FROM manufacturer WHERE id = ?', [id], callback);
}

database.all('PRAGMA table_info(manufacturer)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAll, readOne, COLUMN_DATA };