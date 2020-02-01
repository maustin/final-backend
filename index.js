let SERVER_PORT = process.env.PORT;
let app = require('./app');

console.log('Server env:', process.env.NODE_ENV);
app.listen(SERVER_PORT, () => {
	console.log("Server started on port", SERVER_PORT);
});
