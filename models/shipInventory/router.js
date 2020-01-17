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
	if (error)
		next(error);
	else if (data)
		response.json(data);
	else
		response.status(404).send(`ship_inventory with id ${request.params.id} not found`);
});

// no delete - set quantity to 0 to remove from list

// create is admin only
// TODO
//router.post()

// update is admin only
// Table is also updated via purchase, but that will happen in
// purchaseOrder section. (I think.)
// TODO

module.exports = router;