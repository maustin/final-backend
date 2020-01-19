const COLUMN_DATA = [];
let database = require('../../database');

function readOne(id, callback) {
	console.log('purchaseOrderItem readOne');
	database.get('SELECT * FROM purchase_order_item WHERE id = ?', [id], callback);
}

function create (shipInventoryId, quantity, purchaseOrderId, callback) {
	console.log('purchaseOrderItem create', shipInventoryId, quantity, purchaseOrderId);
	// Intermediate handler to grab proper 'this', the sql query
	function createHandlerCallback(error, data) {
		console.log('PuchaseOrderItem createHandlerCallback');
		if (error)
			callback(error);
		else {
			console.log('PuchaseOrderItem created with id:', this.lastID);
			callback(null, this.lastID);
		}
	}

	database.run('INSERT INTO purchase_order_item ("ship_inventory_id", "purchase_order_id", "quantity") VALUES (?, ?, ?)',
		[shipInventoryId, purchaseOrderId, quantity], createHandlerCallback);
}

module.exports = { readOne, create, COLUMN_DATA };