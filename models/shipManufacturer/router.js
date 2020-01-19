let express = require('express');
let model = require('./model');
let router = express.Router();

router.get('/getbyshipdefid/:id', (request, response, next) => {
	model.readAllWithShipDefId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else
			response.json(data);
		// data will be empty array if no results
	})
});

router.get('/getbymanufacturerid/:id', (request, response, next) => {
	model.readAllWithManufacturerId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else
			response.json(data);
		// data will be empty array if no results
	})
});

module.exports = router;