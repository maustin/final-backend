let inventoryController = require('../shipInventory/controller');
let purchaseOrderItemModel = require('../purchaseOrderItem/model');
let purchaseOrderModel = require('model');

// 'items' is an array of objects containing an inventory id and a quantity
// [{'ship_inventory_id': #, 'quantity': #}]
function purchase(items) => {
	return new Promise((resolve, reject) => {
		// Attempt to remove quantity from inventory
		try {
			await inventoryController.purchase(items);
		}
		catch (e) {
			console.error('PurchaseOrder Controller inventoryController purchase error:', e);
			reject(410);// insufficient quantity, probably
		}

		// Create the purchase order
		try {
			purchaseOrderModel.purchase(items);
		}
		catch (e) {
			console.error('PurchaseOrder Controller purchaseOrderModel purchase error:', e);
			// rollback inventory
			reject(500);// internal error
		}

		// Create purchase order line items
		try {

		}
		

	})
}

module.exports = { purchase };