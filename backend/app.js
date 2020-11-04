const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

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

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		crypto.randomBytes(10, (err, buf) => {
			cb(null, `${buf.toString('hex')} - ${file.originalname}`);
		});
	}
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(
	cors({
		// origin: 'http://localhost:3000',
		// methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
		credentials: true
	})
);

app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

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

app.use('/auth', authRoute);

app.use(csrfProtection);

app.get('/csrf', (req, res, next) => {
	console.log('csrf token ' + req.csrfToken());
	res.json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user._id)
			.then((user) => {
				if (!user) return next();
				req.user = user;
				next();
			})
			.catch((err) => {
				throw new Error(err);
			});
	} else {
		next();
	}
});

app.use('/shop', shopRoute);

app.use('/admin', adminRoute);

app.use((err, req, res, next) => {
	res.json(500);
});

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
