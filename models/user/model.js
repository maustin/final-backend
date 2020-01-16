let database = require('../../database');
const COLUMN_DATA = [];

function readOne(email, callback) {
	database.get('SELECT * FROM user WHERE email = ?', [email], callback);
}

function remove(email, callback) {
	// TODO
	console.error('user.remove is not yet implemented');
}

function create(parameters, callback) {
	database.run('INSERT INTO user ("username", "email", "homeworld", "password", "created_at") VALUES (?, ?, ?, ?, ?)',
		[parameters['username'], parameters['email'], parameters['homeworld'], parameters['password'], Math.floor(Date.now() / 1000)],
		callback);
}

function update(parameters, callback) {
	// TODO
	console.error('user.update is not yet implemented');
}

function setLastLogin(id, callback) {
	database.run('UPDATE user SET last_login = ? WHERE id = ?',
		[Math.floor(Date.now() / 1000)], callback);
}

function resetPassword(id, callback) {
	// TODO
	console.error('user.resetPassword is not yet implemented');
}

database.all('PRAGMA table_info(user)', (error, rows) => {
	if (error)
		console.error(error);
	else
		rows.forEach(item => COLUMN_DATA.push(item));
});

module.exports = { readOne, remove, create, update, setLastLogin, resetPassword, COLUMN_DATA};