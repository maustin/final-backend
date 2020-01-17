let express = require('express');
let model = require('./model');
let router = express.Router();

router.get('/getbyshipdefid/:id', (request, response, next) => {
	model.readAllWithShipDefId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else if (data && data.length)
			response.json(data);
		else
			response.status(404).send(`ship_manufacturer with ship_def_id ${request.params.id} not found`);
	})
});

router.get('/getbymanufacturerid/:id', (request, response, next) => {
	model.readAllWithManufacturerId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else if (data && data.length)
			response.json(data);
		else
			response.status(404).send(`ship_manufacturer with manufacturer_id ${request.params.id} not found`);
	})
});

module.exports = router;