let express = require('express');
let model = require('./model');
let router = express.Router();

router.get('/', (request, response, next) => {
	model.readAll((error, data) => {
		if (error)
			next(error);
		else
			response.json(data);
	});
});

router.get('/:id', (request, response, next) => {
	model.readOne(request.params.id, (error, data) => {
		if (error)
			next(error);
		else if (data)
			response.json(data);
		else
			response.status(404).send(`ship_def id ${request.params.id} not found`);
	});
});

// CREATE, UPDATE, DELETE not permitted

module.exports = router;