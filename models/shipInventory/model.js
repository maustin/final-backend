const COLUMN_DATA = [];
let database = require('../../database');

function readAll(callback) {
	database.add('SELECT * FROM ship_inventory', callback);
}

function readOne(id, callback) {
	database.get('SELECT * FROM ship_inventory WHERE id = ?', [id], callback);
}

// TODO
// create

// TODO
// update

database.all('PRAGMA table_info(ship_inventory)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAll, readOne, COLUMN_DATA };