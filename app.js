let express = require('express');
let cors = require('cors');
let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console logging
// app.use((request, response, next) => {
// 	console.log(`URL:${req.url} - METHOD:${req.method} - AT:${new Date().toLocaleString()}`);
// 	next();
// })

let authRouter = require('./auth/router');

app.use('/v1/auth', authRouter);

app.get('/', (request, response, next) => {
	res.send('Hello.');
});

module.exports = app;