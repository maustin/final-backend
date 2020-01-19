let express = require('express');
let model = require('./model');
let router = express.Router();

router.get('/', (request, response, next) => {
	model.readAll((error, data) => {
		if (error) {
			console.error('Manufacturer model readAll error:', error);
			response.sendStatus(500);
		}
		else
			response.json(data);
	});
});

router.get('/:id', (request, response, next) => {
	model.readOne(request.params.id, (error, data) => {
		if (error) {
			console.error('Manufacturer model readOne error:', error);
			response.sendStatus(500);
		}
		else
			response.json(data);
		// data will just be an empty array if no results
		//else
		//	response.status(404).send(`Manufacturer id ${request.params.id} not found`);
	});
});

module.exports = router;