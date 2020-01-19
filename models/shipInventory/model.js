const COLUMN_DATA = [];
let database = require('../../database');

function readAll(callback) {
	database.all('SELECT * FROM ship_inventory', callback);
}

function readOne(id, callback) {
	database.get('SELECT * FROM ship_inventory WHERE id = ?', [id], callback);
}

function readOneWithQuantity(id, quantity, callback) {
	database.get('SELECT * FROM ship_inventory WHERE id = ? AND quantity >= ?', [id, quantity], callback);
}

function purchase(shipInventoryId, quantity, callback) {
	readOneWithQuantity(shipInventoryId, quantity, (error, data) => {
		if (error)
			callback(error);
		else if (!data)
			callback('Insufficient quantity');
		else {
			let cost = data.price * quantity;
			database.run('UPDATE ship_inventory SET quantity = ? WHERE id = ?', [data.quantity - quantity, shipInventoryId], (error, data) => {
				if (error)
					callback(error);
				else
					callback(null, cost);
			});
		}
	});
}

function revertPurchase(shipInventoryId, quantity, callback) {
	readOne(shipInventoryId, (error, data) => {
		if (error)
			callback(error);
		else if (!data)
			callback(`Failed to find inventory item to revert, id:${shipInventoryId}`);
		else {
			database.run('UPDATE ship_inventory SET quantity = ? WHERE id = ?', [data.quantity + quantity, shipInventoryId], (error, data) => {
				if (error)
					callback(error);
				else
					callback(null, data);
			});
		}
	});
}

// TODO: Admin ability to add inventory?

database.all('PRAGMA table_info(ship_inventory)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAll, readOne, COLUMN_DATA };