let inventoryController = require('../shipInventory/controller');
let purchaseOrderItemModel = require('../purchaseOrderItem/model');
let purchaseOrderModel = require('model');

// 'items' is an array of objects containing an inventory id and a quantity
// [{'ship_inventory_id': #, 'quantity': #}]
function purchase(userId, paymentTypeId, items) => {
	return new Promise((resolve, reject) => {
		// Attempt to remove quantity from inventory
		let subtotal;
		// TODO: tax
		let tax = 0;

		try {
			subtotal = await inventoryController.purchase(items);
			console.log("subtotal", subtotal);
		}
		catch (e) {
			console.error('PurchaseOrder Controller inventoryController purchase error:', e);
			reject(410);// insufficient quantity, probably
		}

		// Create the purchase order
		try {
			await new Promise((resolve, reject) => {
				purchaseOrderModel.purchase(userId, paymentTypeId, subtotal, tax, (error, data) => {
					if (error)
						reject(error)
					else
						resolve(data);
				});
			});
		}
		catch (e) {
			console.error('PurchaseOrder Controller purchaseOrderModel purchase error:', e);
			// TODO: rollback inventory
			reject(500);
		}

		// Create purchase order line items
		try {

		}
		

	})
}

module.exports = { purchase };