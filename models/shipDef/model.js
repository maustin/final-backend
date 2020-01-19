const COLUMN_DATA = [];
let database = require('../../database');

function readAll(callback) {
	console.log('shipDef readAll');
	database.all('SELECT * FROM ship_def', callback);
}

function readOne(id, callback) {
	console.log('shipDef readOne');
	database.get('SELECT * FROM ship_def WHERE id = ?', [id], callback);
}

database.all('PRAGMA table_info(ship_def)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAll, readOne, COLUMN_DATA };