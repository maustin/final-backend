let purchaseOrderItemModel = require('./model');

async function create(items, purchaseOrderId) {
	console.log('purchaseOrderItem controller create');
	let completedItems = [];
	let error;

	for (item of items) {
		let itemId;
		try {
			itemId = await createSingle(item.ship_inventory_id, item.quantity, purchaseOrderId);
		}
		catch (e) {
			console.log('purchaseOrderItem controller got error', e);
			error = e;
			break;
		}
		completedItems.push(itemId);
	}

	if (error) {
		// TODO: revert now-erroneous completed items?
		//reject(error);
		throw new Error(error);
	}
	else {
		//resolve(completedItems);
		return completedItems;
	}
}

function createSingle(shipInventoryId, quantity, purchaseOrderId) {
	return new Promise((resolve, reject) => {
		console.log('purchaseOrderItem controller createSingle');
		purchaseOrderItemModel.create(shipInventoryId, quantity, purchaseOrderId, (error, data) => {
			if (error)
				reject(error);
			else
				resolve(data);
		});
	});
}

module.exports = { create };