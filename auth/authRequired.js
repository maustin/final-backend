let jwt = require('jsonwebtoken');
const SECRET = process.env.AUTH_SECRET;

module.exports = (request, response, next) => {
	// BYPASS
	/*if (true) {
		request.userId = 42;
		next();
		return;
	}*/

	console.log('auth check');
	let bearerHeader = request.headers['authorization'];

	if (typeof(bearerHeader) !== 'undefined') {
		let bearer = bearerHeader.split(' ');
		let bearerToken = bearer[1];
		request.token = bearerToken;

		//let verified = jwt.verify(request.token, SECRET);
		//console.log('Token verified:', verified);
		//request.userId = verified._id;
		//next();

		jwt.verify(request.token, SECRET, (err, decoded) => {
			if (err)
				response.status(401).send('Failed authorization');
			else {
				console.log(decoded);
				request.userId = decoded.id;
				next();
			}
		});
	}
	else {
		response.status(403).send('Missing authorization');
	}
}
