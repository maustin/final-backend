let express = require('express');
let model = require('./model');
let inventoryModel = require('../shipInventory/model');
let authRequired = require('../../auth/authRequired');
let paymentValid = require('../../auth/paymentValid');
let router = express.Router();

// No general get all

router.get('/:id', authRequired, (request, response, next) => {
	model.readOne(request.params.id, request.userId, (error, data) => {
		if (error)
			next(error);
		else if (data)
			response.json(data);
		else
			response.status(404).send('Cannot find purchase order matching criteria.');
	});
});

router.get('/byuserid/:id', authRequired, (request, response, next) => {
	model.readAllByUserId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else if (data)
			response.json(data);
		else
			response.status(404).send('No purchase orders found.');
	});
});

// no delete

// Purchase
// body: {
//   items: [{'ship_inventory_id', 'qty'}]
// }
router.post('/', authRequired, paymentValid, (request, response, next) => {
	inventoryModel.purchase(request.body.items, (error, data) => {
		if (error) {
			console.error('InventoryModel purchase error:', error);
			// Is '410: Gone' appropriate?
			response.status(410).send(`Insufficient quantity`);
		}
		else {
			// Quantities subtracted from stock, create PO
			model.purchase(request.body, (error, data) => {
				if (error) {
					console.error('PurchaseOrder purchase error:', error);

					inventoryModel.revertPurchase(request.body.items, (error, data) => {
						if (error)
							console.error('InventoryModel revert purchase error:', error);
						else
							console.log('Purchase reverted');
					});

					response.status(500).send('Server error');
				}
				else
					response.sendStatus(200);
			});
		}
	});
});

module.exports = router;