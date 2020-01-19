let express = require('express');
let model = require('./model');
let router = express.Router();

router.get('/:id', (request, response, next) => {
	model.readOne(request.params.id, (error, data) => {
		if (error) {
			console.error('PurchaseOrderItem model readOne error:', error);
			response.sendStatus(500);
		}
		else
			response.json(data);
		// data will be empty array if no results
	});
});

module.exports = router;