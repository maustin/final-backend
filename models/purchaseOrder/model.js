const COLUMN_DATA = [];
let database = require('../../database');
let purchaseOrderItemModel = require('../purchaseOrderItem/model');

function readOne(purchaseOrderId, userId, callback) {
	console.log('puchaseOrder readOne');
	database.get('SELECT * FROM purchase_order WHERE id = ? AND user_id = ?', [purchaseOrderId, userId], callback);
}

function readAllByUserId(id, callback) {
	console.log('purchaseOrder readAllByUserId');
	database.all('SELECT * FROM purchase_order WHERE user_id = ?', [id], callback);
}

function purchase(userId, paymentMethodId, paymentAmount, taxPaid, callback) {
	console.log('purchaseOrder purchase', userId);
	// Intermediate handler to grab proper 'this', the sql query
	function purchaseHandlerCallback(error, data) {
		console.log('purchase order callback');
		console.log(error, data);
		if (error)
			callback(error);
		else {
			console.log("purchase order created with id:", this.lastID);
			callback(null, this.lastID);
		}
	}

	database.run('INSERT INTO purchase_order ("user_id", "payment_method_id", "payment_amount", "tax_paid", "purchase_date") VALUES (?, ?, ?, ?, ?)',
		[userId, paymentMethodId, paymentAmount, taxPaid, Math.floor(Date.now() / 1000)], purchaseHandlerCallback);
}

database.all('PRAGMA table_info(purchase_order)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readOne, readAllByUserId, purchase, COLUMN_DATA };