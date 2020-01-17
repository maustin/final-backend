let express = require('express');
let model = require('./model');
let router = express.Router();

// No general get all

router.get('/:id', (request, response, next) => {
	model.readOne(request.params.id, (error, data) => {
		if (error)
			next(error);
		else if (data)
			response.json(data);
		else
			response.status(404).send(`purchase_order with id ${request.params.id} not found`);
	});
});

// TODO: validate this request from same user, or admin
router.get('/byuserid/:id', (request, response, next) => {
	model.readAllByUserId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else if (data)
			response.json(data);
		else
			response.status(404).send(`purchase_orders with user_id ${request.params.id} not found`);
	});
});

// no delete

router.post('/', (request, response, next) => {
	// TODO: validate data, quantity is valid
	model.create(request.body, (error, data) => {
		if (error)
			next(error);
		else
			response.sendStatus(200);
	});
});

// no reason to update

module.exports = router;