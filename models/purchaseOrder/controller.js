let inventoryController = require('../shipInventory/controller');
let purchaseOrderItemController = require('../purchaseOrderItem/controller');
let purchaseOrderModel = require('./model');

// 'items' is an array of objects containing an inventory id and a quantity
// [{'ship_inventory_id': #, 'quantity': #}]
async function purchase(userId, paymentTypeId, items) {
	console.log("purchseorder controller purchase", items);
	// Attempt to remove quantity from inventory
	let subtotal;
	// TODO: tax
	let tax = 0;

	try {
		subtotal = await inventoryController.purchase(items);
		console.log("subtotal", subtotal);
	}
	catch (e) {
		// InventoryController will handle revert for itself here
		console.error('PurchaseOrder Controller inventoryController purchase error:', e);
		//reject(410);// insufficient quantity, probably
		//return;
		throw new Error('410');
	}

	// Create the purchase order
	let purchaseOrderId;
	try {
		purchaseOrderId = await new Promise((resolve, reject) => {
			purchaseOrderModel.purchase(userId, paymentTypeId, subtotal, tax, (error, data) => {
				console.log('PurchaseOrderModel purchase data:', data);

				if (error)
					reject(error)
				else
					resolve(data);
			});
		});
	}
	catch (e) {
		console.error('PurchaseOrder Controller purchaseOrderModel purchase error:', e);
		revertPurchase(items);
		//reject(500);
		//return;
		throw new Error('500');
	}

	// Create purchase order line items
	try {
		await purchaseOrderItemController.create(items, purchaseOrderId);
	}
	catch (e) {
		console.error('purchaseOrderItemController create error:', e);
		revertPurchase(items);
		//reject(500);
		//return;
		throw new Error('500')
	}

	// All done? Purchase sucessful!
	//resolve();
}

async function revertPurchase(items) {
	// TODO: consider deleting now invalid PurchaseOrder if it was created
	// do we care about async here?
	try {
		await inventoryController.revertPurchase(items);
	}
	catch (e) {
		console.error('InventoryController revertPurchase error:', e);
	}
}


module.exports = { purchase };