let model = require('./model');

async function purchase(items) {
	console.log('ShipInventory purchase purchase');
	//let completedItems = [];
	let error;
	let totalPrice = 0;

	for (item of items) {
		console.log(item);
		try {
			let price = await purchaseSingle(item.ship_inventory_id, item.quantity);
			console.log("got price", price);
			totalPrice += price;
		}
		catch (e) {
			error = e;
			break;
		}
		//completedItems.push(item);
	}

	if (error) {
		// TODO: revert
		console.error('Failed ShipInventory model purchaseSingle:', error);
		/*(if (completedItems.length) {
			try {
				await revertPurchase(completedItems);
			}
			catch (e) {
				console.error('ShipInventory controller revertPurchase error:', e);
			}
		}*/
		// revert completed
		//reject(error);
		throw new Error(error);
	}
	else {
		//resolve(totalPrice);
		return totalPrice;
	}
}

function purchaseSingle(shipInventoryid, quantity) {
	return new Promise((resolve, reject) => {
		console.log('ShipInventory controller purchaseSingle');
		model.purchase(shipInventoryid, quantity, (error, data) => {
			console.log(`ShipInventory controller purchaseSingle model purchase returned error: ${error} data: ${data}`);
			if (error)
				reject(error);
			else
				resolve(data);// data is the price * quantity
		});
	});
}

async function revertPurchase(items) {
	//return new Promise((resolve, reject) => {
		let errors = [];
		for (item of items) {
			try {
				await revertPurchaseSingle(item.ship_inventory_id, item.quantity);
			}
			catch (e) {
				// collect errors instead of rejecting immediately
				errors.push(e);
			}
		}

		if (errors.length)
			throw new Error(errors);
			//reject(errors);
		//else
		//	resolve();
	//});
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