const COLUMN_DATA = [];
let database = require('../../database');
let purchaseOrderItemModel = require('../purchaseOrderItem/model');

function readOne(purchaseOrderId, userId, callback) {
	database.get('SELECT * FROM purchase_order WHERE id = ? AND user_id = ?', [purchaseOrderId, userId], callback);
}

function readByAllUserId(id, callback) {
	database.all('SELECT * FROM purchase_order WHERE user_id = ?', [id], callback);
}

function purchase(userId, paymentMethodId, paymentAmount, taxPaid, callback) {
	// Intermediate handler to grab proper 'this', the sql query
	function purchaseHandlerCallback(error, data) {
		if (error)
			callback(error);
		else {
			console.log("purchase order created with id:", this.lastID);
			callback(null, this.lastID);
		}
	}

	database.run('INSERT INTO purchase_order ("user_id", "payment_method_id", "payment_amount", "tax_paid", "purchase_date") VALUES (?, ?, ?, ?, ?)',
		[userId, paymentMethodId, taxPaid, Math.floor(Date.now() / 1000)], purchaseHandlerCallback);
}

database.all('PRAGAMA table_info(purchase_order)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readOne, readByAllUserId, purchase, COLUMN_DATA };