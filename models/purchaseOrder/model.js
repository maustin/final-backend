const COLUMN_DATA = [];
let database = require('../../database');

function readOne(id, callback) {
	database.get('SELECT * FROM purchase_order WHERE id = ?', [id], callback);
}

function readByAllUserId(id, callback) {
	database.all('SELECT * FROM purchase_order WHERE user_id = ?', [id], callback);
}

function create(params, callback) {
	// TODO: validate params valid
	database.run('INSERT INTO purchase_order ("user_id", "payment_method_id", "payment_amount", "tax_paid", "purchase_date",) VALUE (?, ?, ?, ?, ?)',
		[params.user_id, params.payment_method_id, params.payment_amoutn, params.tax_paid, Math.floor(Date.now() / 1000)],
		callback);
	// TODO: also kick off purchaseOrderItem create
}

database.all('PRAGAMA table_info(purchase_order)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readOne, readByAllUserId, create, COLUMN_DATA };