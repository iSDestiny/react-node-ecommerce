const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/shop', shopRoute);

app.use('/admin', adminRoute);

app.get('/', (req, res, next) => {
	res.send('testbase');
});

app.listen(8080);
