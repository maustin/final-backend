let express = require('express');
let model = require('./model');
let controller = require('./controller');
let authRequired = require('../../auth/authRequired');
let paymentValid = require('../../auth/paymentValid');
let router = express.Router();

router.get('/:id', authRequired, (request, response, next) => {
	model.readOne(request.params.id, request.userId, (error, data) => {
		if (error) {
			console.error('PurchaseOrder model readOne error:', error);
			response.sendStatus(500);
		}
		else if (data)
			response.json(data);
		else
			response.sendStatus(404);
	});
});

router.get('/byuserid/:id', authRequired, (request, response, next) => {
	model.readAllByUserId(request.params.id, (error, data) => {
		if (error) {
			console.error('PurchaseOrder model readAllByUserId error:', error);
			response.sendStatus(500);
		}
		else
			response.json(data);
		// data will be empty array if no results
	});
});

router.post('/', authRequired, paymentValid, async (request, response, next) => {
	console.log('Trying purchase order');
	//console.log(request.body);
	if (!request.body || !request.body.length) {
		console.log('failed body check');
		response.sendStatus(400);
	}
	else {
		console.log('body ok, controller purchase');//, request);
		try {
			await controller.purchase(request.userId, request.paymentTypeId, request.body);
			response.sendStatus(200);
		}
		catch (e) {
			console.log('got error', e);
			if (e.message === '410')
				response.status(410).send('Insufficient quantity');
			else
				response.sendStatus(500);
			// really client doesn't need to know anything other than insufficient quantity or server error
		}
	}
});

module.exports = router;