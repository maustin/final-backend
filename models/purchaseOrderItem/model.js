const COLUMN_DATA = [];
let database = require('../../database');

function readOne(id, callback) {
	database.get('SELECT * FROM purchase_order_item WHERE id = ?', [id], callback);
}

async function create(ship_inventory_id, quantity, purchase_order_id, callback) {
	//return new Promise((resolve, reject) => {
		database.run('INSERT INTO purchase_order_item ("ship_inventory_id", "purchase_order_id", "quantity") VALUES (?, ?, ?)',
			[ship_inventory_id, purchase_order_id, quantity],
			callback);
			// (error, data) => {
			// 	if (error)
			// 		reject(error);
			// 	else
			// 		resolve();
			// })
	//});
}