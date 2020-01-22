const COLUMN_DATA = [];
let database = require('../../database');

function readAll(callback) {
	console.log('shipInventory readAll');
	database.all('SELECT ship_inventory.*, ship_def.*, promo.price_mod FROM ship_inventory JOIN ship_def ON ship_def.id = ship_inventory.ship_def_id JOIN promo ON promo.id = ship_inventory.promo_id', callback);
}

function readOne(id, callback) {
	console.log('shipInventory readOne');
	database.get('SELECT ship_inventory.*, ship_def.*, promo.price_mod FROM ship_inventory JOIN ship_def ON ship_def.id = ship_inventory.ship_def_id JOIN promo ON promo.id = ship_inventory.promo_id WHERE ship_inventory.id = ?', [id], callback);
}

function readOneWithPromoId(id, callback) {
	console.log("shipInventory readOneWithPromoId");
	database.get('SELECT ship_inventory.*, ship_def.*, promo.price_mod FROM ship_inventory JOIN ship_def ON ship_def.id = ship_inventory.ship_def_id JOIN promo ON promo.id = ship_inventory.promo_id WHERE promo_id = ?', [id], callback);
}

function readOneWithQuantity(id, quantity, callback) {
	console.log('shipInventory readOneWithQuantity');
	database.get('SELECT * FROM ship_inventory WHERE id = ? AND quantity >= ?', [id, quantity], callback);
}

function purchase(shipInventoryId, quantity, callback) {
	console.log('shipInventory purchase', shipInventoryId);
	readOneWithQuantity(shipInventoryId, quantity, (error, data) => {
		if (error)
			callback(error);
		else if (!data)
			callback('Insufficient quantity');
		else {
			let cost = data.price * quantity;
			console.log('shipInventory purchase cost:', cost);
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
	console.log('shipInventory revertPurchase');
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

module.exports = { readAll, readOne, readOneWithPromoId, purchase, revertPurchase, COLUMN_DATA };