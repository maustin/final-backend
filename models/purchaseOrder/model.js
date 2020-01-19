const COLUMN_DATA = [];
let database = require('../../database');
let purchaseOrderItemModel = require('../purchaseOrderItem/model');

function readOne(po_id, user_id, callback) {
	database.get('SELECT * FROM purchase_order WHERE id = ? AND user_id = ?', [po_id, user_id], callback);
}

function readByAllUserId(id, callback) {
	database.all('SELECT * FROM purchase_order WHERE user_id = ?', [id], callback);
}

// body: {
//   items: [{'ship_inventory_id', 'qty'}]
// }
// TODO: I think the model shouldn't be doing the additional POItem creation.
// Move this out to the router?
function purchase(params, callback) {
	// Execution of this method starts with the last statement, database.run

	let poItemCreatedCallback = function(error, data) {
		return new Promise((resolve, reject) => {
			if (error) {
				console.error('Create Purchase Order Item error', error);
				reject(error);
			}
			resolve();
		});
	};

	let poCreatedCallback = async function(error, data) {
		if (error)
			callback(error);
		else {
			// Create Purchase Order Item for each ship type bought
			// TODO: I think this loop should be moved into purchase order's model.
			let poId = this.lastId;
			for (item of params.items) {
				try {
					await purchaseOrderItemModel.create(item.ship_id, item.qty, poId, poItemCreatedCallback);
				}
				catch (e) {
					callback(e);
				}
			}

			// When we get here, everything is done...
			callback(null, { status: "OK", purchase_order_id: poId });
		}
	};

	database.run('INSERT INTO purchase_order ("user_id", "payment_method_id", "payment_amount", "tax_paid", "purchase_date",) VALUE (?, ?, ?, ?, ?)',
		[params.user_id, params.payment_method_id, params.payment_amoutn, params.tax_paid, Math.floor(Date.now() / 1000)],
		poCreatedCallback);
}

database.all('PRAGAMA table_info(purchase_order)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readOne, readByAllUserId, create, COLUMN_DATA };