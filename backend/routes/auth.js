const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');

router.get('/authenticated', (req, res, next) => {
	// console.log(req.session.user);
	res.json({ isAuthenticated: req.session.isLoggedIn });
});

router.post('/signup', (req, res, next) => {
	const { email, password, confirmPassword } = req.body;
	User.findOne({ email: email })
		.then(async (user) => {
			if (user) {
				return res.json({ message: 'email already exists' });
			}
			const encryptedPassword = await bcrypt.hash(password, 12);
			const newUser = new User({
				email: email,
				password: encryptedPassword,
				cart: { items: [] }
			});
			return newUser.save();
		})
		.then((result) => {
			res.sendStatus(201);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/login', (req, res, next) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then(async (user) => {
			const didMatch = await bcrypt.compare(password, user.password);
			if (user && didMatch) {
				req.session.isLoggedIn = true;
				req.session.user = user;
				console.log(req.session);
				res.json({ success: true });
			} else {
				res.json({ success: false });
			}
		})
		.catch((err) => console.log(err));
});

router.post('/logout', (req, res, next) => {
	req.session.destroy(() => {
		res.sendStatus(200);
	});
});

module.exports = router;
