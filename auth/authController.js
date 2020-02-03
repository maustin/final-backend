const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('./register');
const userTable = require('../models/user/model');

const SECRET = process.env.AUTH_SECRET;

// POST Register
const register = (request, response) => {
	console.log('register');

	const { errors, notValid } = validate(request.body);

	if (notValid) {
		return response.status(400).json({ status: 400, errors });
	}

	userTable.readOne(request.body.email, (err, foundUser) => {
		if (err) {
			console.error('Register User check email exists error:', err);
			return response.status(500).json({
				status: 500,
				message: 'Something went wrong. Please try again.'
			});
		}

		if (foundUser) {
			return response.status(400).json({
				status: 400,
				message: 'Email address has already been registered.'
			});
		}

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				console.error('bcrypt genSalt error:', err);
				return response.status(500).json({
					status: 500,
					message: 'Something went wrong. Please try again.'
				})
			}

			bcrypt.hash(request.body.password, salt, (err, hash) => {
				if (err) {
					console.error('bcrypt hash error:', err);
					return response.status(500).json({
						status: 500,
						message: 'Something went wrong. Please try again.'
					})
				}

				let newUser = {
					email: request.body.email,
					password: hash,
					homeworld: request.body.homeworld,
				};

				userTable.create(newUser, (err, data) => {
					if (err)
						return response.status(500).json({ status: 500, message: err });

					response.status(201).json({ status: 201, message: 'success' });
				});
			});
		})
	});
}

const login = (request, response) => {
	console.log('login');

	if (!request.body.email || !request.body.password) {
		return response.status(400).json({ status: 400, message: 'Please enter email and password.' });
	}

	userTable.readOne(request.body.email, (err, foundUser) => {
		if (err) {
			console.error('Login failed reading user by email:', err);
			return response.status(500).json({
				status: 500,
				message: 'Something went wrong. Please try again.'
			});
		}

		if (!foundUser) {
			return response.status(400).json({
				status: 400,
				message: 'Email or password is incorrect. Please try again.'
			});
		}

		bcrypt.compare(request.body.password, foundUser.password, (err, isMatch) => {
			if (err) {
				console.error('bcrypt compare error:', err);
				return response.status(500).json({
					status: 500,
					message: 'Something went wrong. Please try again.'
				});
			}

			if (!isMatch) {
				return response.status(400).json({
					status: 400,
					message: 'Email or password is incorrect. Please try again.'
				});
			}
			else {
				// set last login timestamp
				userTable.setLastLogin(foundUser.id, (err, data) => {
					// don't terribly care
					if (err)
						console.err('User setLastLogin error:', err);
				});

				let user = {
					id: foundUser.id
				};

				jwt.sign(
					user, // payload
					SECRET, // secret
					{
						expiresIn: '1hr'
					},
					(err, signedJwt) => {
						// TODO: shouldn't we be checking the for err here?
						return response.status(200).json({
							status: 200,
							message: 'success',
							id: foundUser.id,
							signedJwt
						});
					});
			}
		})
	});
}

module.exports = { register, login };
