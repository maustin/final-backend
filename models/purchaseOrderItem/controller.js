let purchaseOrderItemModel = './model';

async function create(items, purchaseOrderId) {
	//return new Promise((resolve, reject) => {
		let completedItems = [];
		let error;

		for (item of items) {
			let itemId;
			try {
				itemId = await createSingle(item.shipInventoryId, item.quantity, purchaseOrderId);
			}
			catch (e) {
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
	//});
}

function createSingle(shipInventoryId, quantity, purchaseOrderId) {
	return new Promise((resolve, reject) => {
		purchaseOrderItemModel.create(shipInventoryId, quantity, purchaseOrderId, (error, data) => {
			if (error)
				reject(error);
			else
				resolve(data);
		});
	});
}

module.exports = { create };