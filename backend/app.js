const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// const mongoConnect = require('./utility/database').mongoConnect;
const mongoose = require('mongoose');

const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

const User = require('./model/user');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	User.findById('5f9a147be369be44d0cc17c4')
		.then((user) => {
			req.user = user;
			console.log(user);
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/shop', shopRoute);

app.use('/admin', adminRoute);

app.get('/', (req, res, next) => {
	res.send('testbase');
});

mongoose.connect('mongodb+srv://jason:matkim525@cluster0.q46pp.mongodb.net/node-course?retryWrites=true&w=majority').then(result => {
	// console.log(result)
	app.listen(8080);
}).catch(err => {
	console.log(err);
})