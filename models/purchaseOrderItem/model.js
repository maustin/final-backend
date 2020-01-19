const COLUMN_DATA = [];
let database = require('../../database');

function readOne(id, callback) {
	database.get('SELECT * FROM purchase_order_item WHERE id = ?', [id], callback);
}

function create (shipInventoryId, quantity, purchaseOrderId, callback) {
	// Intermediate handler to grab proper 'this', the sql query
	function createHandlerCallback(error, data) {
		if (error)
			callback(error);
		else {
			console.log('PuchaseOrderItem created with id:', this.lastID);
			callback(null, this.lastID);
		}
	}

	data.run('INSERT INTO purchase_order_item ("ship_inventory_id", "purchase_order_id", "quantity") VALUES (?, ?, ?)',
		[shipInventoryId, purchaseOrderId, quantity], createHandlerCallback);
}

module.exports = { readOne, create, COLUMN_DATA };