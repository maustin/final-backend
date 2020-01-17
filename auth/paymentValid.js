module.exports = (request, response, next) => {
	console.log('payment check');
	let purchaseDetails = request.body;
	// TODO: validation for each payment type

	next();
}