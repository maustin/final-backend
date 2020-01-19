let express = require('express');
let cors = require('cors');
let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console logging
app.use((request, response, next) => {
	console.log(`URL:${req.url} - METHOD:${req.method} - AT:${new Date().toLocaleString()}`);
	next();
})

let authRouter = require('./auth/router');
let manufacturerRouter = require('./model/manufacturer/router');
let purchaseOrderRouter = require('./model/purchaseOrder/router');
let purchaseOrderItemRouter = require('./model/purchaseOrderItem/router');
let shipDefRouter = require('./model/shipDef/router');
let shipInventoryRouter = require('./model/shipInventory/router');
let shipManfacturerRouter = require('./model/shipManufacturer/router');

app.use('/v1/auth', authRouter);
app.use('/v1/manufacturer', manufacturerRouter);
app.use('/v1/purchaseorder', purchaseOrderRouter);
app.use('/v1/purchaseorderitem', purchaseOrderItemRouter);
app.use('/v1/shipdef', shipDefRouter);
app.use('/v1/shipinventory', shipInventoryRouter);
app.use('/v1/shipmanufacturer', shipManfacturerRouter);

app.get('/', (request, response, next) => {
	res.send('Hello.');
});



module.exports = app;