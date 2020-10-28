const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mongoConnect = require('./utility/database').mongoConnect;

const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

const User = require('./model/user');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	User.findById('5f98cbf855c2cb4d4a5d6ab6')
		.then((user) => {
			req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
	app.listen(8080);
});
