module.exports = ({ username, email, password, password2, homeworld }) => {
	let errors = [];
	if (!username)
		errors.push({ message: 'Please enter a user name.' });

	if (!email)
		errors.push({ message: 'Please enter a valid email.' });

	if (!password)
		errors.push({ message: 'Please enter a password.' });

	if (password != password2)
		errors.push({ message: 'Passwords do not match.' });

	if (!homeworld)
		errors.push({ message: 'Please select your homeworld.' });

	return {
		errors,
		notValid: Boolean(errors.length)
	};
};