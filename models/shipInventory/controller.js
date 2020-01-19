let model = './model';

function purchase(items) {
	return new Promise((resolve, reject) => {
		let completedItems = [];
		let error;

		for (item of items) {
			try
				await purchaseSingle(item.ship_inventory_id, item.quantity);
			catch(e) {
				error = e;
				break;
			}
			completedItems.push(item);
		}

		if (error) {
			if (completedItems.length) {
				try
					await revertPurchase(completedItems);
				catch (e)
					console.error('ShipInventory controller revertPurchase error:', e);
			}
			// revert completed
			reject(error);
		}
		else {
			resolve();
		}
	});
}

function purchaseSingle(shipInventoryid, quantity) {
	return new Promise((resolve, reject) => {
		model.purchase(shipInventoryid, quantity, (error, data) => {
			if (error)
				reject(error);
			else
				resolve();
		});
	});
}

function revertPurchase(items) {
	return new Promise((resolve, reject) => {
		let errors = [];
		for (item of items) {
			try
				await revertPurchaseSingle(item.ship_inventory_id, item.quantity);
			catch(e) {
				// collect errors instead of rejecting immediately
				errors.push(e);
			}
		}

		if (errors.length)
			reject(errors);
		else
			resolve();
	});
}

function revertPurchaseSingle(shipInventoryid, quantity) {
	return new Promise((resolve, reject) => {
		model.revertPurchase(shipInventoryid, quantity, (error, data) => {
			if (error)
				reject(error);
			else
				resolve();
		})
	})
}

module.exports = { purchase, revertPurchase };