const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.q46pp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
// const __dirname = path.resolve();

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

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'access.log'),
	{ flags: 'a' }
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(
	cors({
		origin: 'http://localhost:3000',
		allowedHeaders: ['Content-Type', 'Authorization'],
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
		credentials: true
	})
);

app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoute);

app.use('/shop', shopRoute);

app.use('/admin', adminRoute);

app.use((error, req, res, next) => {
	console.log(error.message, error.allErrors);
	const status = error.status || 500;
	res.status(status).json({
		message: error.message,
		allErrors: error.allErrors
	});
});

app.get('/', (req, res, next) => {
	res.send('testbase');
});

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(process.env.PORT || 8080);
	})
	.catch((err) => {
		console.log(err);
	});
