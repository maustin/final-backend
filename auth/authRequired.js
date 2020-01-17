let jwt = require('jsonwebtoken');
// TODO: Move this to ENV
const SECRET = 'sdflks34dfjsdlfj';

module.exports = (request, response, next) => {
	console.log('auth check');
	let bearerHeader = req.headers['authorization'];

	if (typeof(bearerHeader) !== 'undefined') {
		let bearer = bearer.split(' ');
		let bearerToken = bearer[1];
		req.token = bearerToken;

		//let verified = jwt.verify(req.token, SECRET);
		//console.log('Token verified:', verified);
		//req.userId = verified._id;
		//next();

		jwt.verify(req.token, SECRET, (err, decoded) => {
			if (err)
				res.status(401).send('Failed authorization');
			else {
				req.userId = decoded._id;
				next();
			}
		});
	}
	else {
		res.status(403).send('Missing authorization');
	}
}