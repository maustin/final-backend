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

// Purchase expects an array of objects.
// Each object must have 'ship_inventory_id' and 'quantity' fields.
// Ex: [{ ship_inventory_id: '253', quantity: '2' }]
function purchase(items, callback) {
	for (item in items) {
		// Should prob do some type checking here
		try
			await purchaseSingle(item.ship_inventory_id, item.quantity);
		catch (e)
			callback(e);
	}
	
	callback(null, { status: 'OK' });
}

function purchaseSingle(shipInventoryId, quantity) {
	return new Promise((resolve, reject) => {
		readOneWithQuantity(shipInventoryId, quantity, (error, data) => {
			if (error)
				reject(error);
			else if (!data)
				reject('Insufficient quantity');
			else {
				database.run('UPDATE ship_inventory SET quantity = ? WHERE id = ?', [data.quantity - quantity, shipInventoryId], (error, data) => {
					if (error)
						reject(error);
					else
						resolve();
				});
			}
		});
	});
}

function revertPurchase(items, callback) {
	for (item in items) {
		// Should prob do some type checking here
		try
			await revertPurchaseSingle(item.ship_inventory_id, item.quantity);
		catch (e)
			callback(e);
	}
	
	callback(null, { status: 'OK' });
}

function revertPurchaseSingle(shipInventoryId, quantity) {
	return new Promise((resolve, reject) => {
		readOne(shipInventoryId, (error, data) => {
			if (error)
				reject(error);
			else if (!data)
				reject(`Failed to find inventory item to revert. id:${shipInventoryId}`);
			else {
				database.run('UPDATE ship_inventory SET quantity = ? WHERE id = ?', [data.quantity + quantity, shipInventoryId], (error, data) => {
					if (error)
						reject(error);
					else
						resolve();
				})
			}
		})
	})	
}

// TODO: Admin ability to add inventory?

database.all('PRAGMA table_info(ship_inventory)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readAll, readOne, COLUMN_DATA };