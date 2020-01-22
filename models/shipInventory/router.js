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
		else
			response.json(data);
		// data will be empty array if no results
	});
});

router.get('/withpromoid/:id', (request, response, next) => {
	model.readOneWithPromoId(request.params.id, (error, data) => {
		if (error)
			next(error);
		else
			response.json(data);
	})
})

// create is admin only
// TODO
//router.post()

// update is admin only
// Table is also updated via purchase, but that will happen in
// purchaseOrder section. (I think.)
// TODO

module.exports = router;