let express = require('express');
let cors = require('cors');
let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console logging
app.use((request, response, next) => {
	console.log(`URL:${request.url} - METHOD:${request.method} - AT:${new Date().toLocaleString()}`);
	next();
})

let authRouter = require('./auth/router');
let manufacturerRouter = require('./models/manufacturer/router');
let purchaseOrderRouter = require('./models/purchaseOrder/router');
let purchaseOrderItemRouter = require('./models/purchaseOrderItem/router');
let shipDefRouter = require('./models/shipDef/router');
let shipInventoryRouter = require('./models/shipInventory/router');
let shipManfacturerRouter = require('./models/shipManufacturer/router');

app.use('/v1/auth', authRouter);
app.use('/v1/manufacturer', manufacturerRouter);
app.use('/v1/purchaseorder', purchaseOrderRouter);
app.use('/v1/purchaseorderitem', purchaseOrderItemRouter);
app.use('/v1/shipdef', shipDefRouter);
app.use('/v1/shipinventory', shipInventoryRouter);
app.use('/v1/shipmanufacturer', shipManfacturerRouter);

app.get('/', (request, response, next) => {
	response.send('Hello.');
});



module.exports = app;