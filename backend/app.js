const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

const MONGODB_URI =
	'mongodb+srv://jason:matkim525@cluster0.q46pp.mongodb.net/node-course?retryWrites=true&w=majority';

const User = require('./model/user');
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
		credentials: true
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	const { url } = req;
	const iscookiesent = req.headers.cookie;
	console.log({ url });
	console.log({ iscookiesent });
	next();
});

app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

app.use((req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user._id)
			.then((user) => {
				req.user = user;
				next();
			})
			.catch((err) => console.log(err));
	} else {
		next();
	}
});

app.use('/auth', authRoute);

app.use('/shop', shopRoute);

app.use('/admin', adminRoute);

app.get('/', (req, res, next) => {
	res.send('testbase');
});

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		// console.log(result)
		app.listen(8080);
	})
	.catch((err) => {
		console.log(err);
	});
