const COLUMN_DATA = [];
let database = require('../../database');

// Return manufacturer ids and name for the provided ship def id
function readAllWithShipDefId(id, callback) {
	database.all('SELECT ship_manufacturer.id, manufacturer.id AS manufacturer_id, manufacturer.name AS manufacturer_name FROM ship_manufacturer JOIN manufacturer ON ship_manufacturer.manufacturer_id = manufacturer.id WHERE ship_def_id = ?', [id], callback);
}

// Return ships manufacturer has built
function readAllWithManufacturerId(id, callback) {
	database.all('SELECT ship_manufacturer.id, ship_def_id.id AS ship_def_id, ship_def.name AS ship_def_name, ship_def.model AS ship_def_model FROM ship_manufacturer JOIN ship_def ON ship_manufacturer.ship_def_id = ship_def.id WHERE manufacturer_id = ?', [id], callback);
}

database.all('PRAGMA table_info(ship_manufacturer)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAllWithShipDefId, readAllWithManufacturerId, COLUMN_DATA };