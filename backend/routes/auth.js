const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(
	sendGridTransport({
		auth: {
			api_key:
				'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'
		}
	})
);

router.get('/authenticated', (req, res, next) => {
	res.json({ isAuthenticated: req.session.isLoggedIn });
});

router.post(
	'/signup',
	body('email', 'Please enter a valid email').isEmail(),
	body(
		'password',
		'Please enter a password that has at least 5 characters'
	).isLength({ min: 5 }),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Confirm password does not match password');
		}
		return true;
	}),
	(req, res, next) => {
		const { email, password } = req.body;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// console.log(errors.array());
			const mainError = errors.array()[0];
			return res.json({
				success: false,
				message: mainError.msg,
				allErrors: errors.array()
			});
		}

		User.findOne({ email: email.toLowerCase() })
			.then(async (user) => {
				if (user) {
					res.json({
						success: false,
						message: 'Email already exists!'
					});
				} else {
					const encryptedPassword = await bcrypt.hash(password, 12);
					const newUser = new User({
						email: email.toLowerCase(),
						password: encryptedPassword,
						cart: { items: [] }
					});
					await newUser.save();
					res.json({ success: true });
					// await transporter.sendMail({
					// 	to: email.toLowerCase(),
					// 	from: 'jbugallon@gmail.com',
					// 	subject: 'Sign up successful',
					// 	html: '<h1> You successfully signed up!</h1>'
					// });
				}
			})
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	}
);

router.post(
	'/login',
	body('email', 'Please enter a valid email').isEmail(),
	body(
		'password',
		'Please enter a password that is at least 5 characters long'
	).isLength({ min: 5 }),
	(req, res, next) => {
		const { email, password } = req.body;
		const errors = validationResult(req);
		console.log(errors.array());
		if (!errors.isEmpty()) {
			return res.json({
				success: false,
				message: errors.array()[0].msg,
				allErrors: errors.array()
			});
		}
		User.findOne({ email: email.toLowerCase() })
			.then(async (user) => {
				if (user) {
					const didMatch = await bcrypt.compare(
						password,
						user.password
					);
					if (didMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						console.log(req.session);
						res.json({ success: true });
					} else {
						res.json({
							success: false,
							message:
								'Either the email did not exist or the password was incorrect'
						});
					}
				} else {
					res.json({
						success: false,
						message:
							'Either the email did not exist or the password was incorrect'
					});
				}
			})
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	}
);

router.post('/logout', (req, res, next) => {
	req.session.destroy(() => {
		res.sendStatus(200);
	});
});

router.post('/reset', (req, res, next) => {
	const email = req.body.email.toLowerCase();
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			res.sendStatus(400);
		}
		const token = buffer.toString('hex');
		User.findOne({ email: email })
			.then(async (user) => {
				if (user) {
					user.resetToken = token;
					user.resetTokenExpiration = Date.now() + 3.6e6;
					await user.save();
					res.json({ success: true });
					await transporter.sendMail({
						to: email,
						from: 'jbugallon@gmail.com',
						subject: 'Password Reset',
						html: `
                        <p>Hello, you requested a password reset</p>
                        <p>Please click this <a href="http://localhost:3000/reset/${token}">link</a> to
                        set up a new password. This link is only valid for <strong>One hour</strong>, please reset
                        your password by then.</p>
                        `
					});
				} else {
					res.json({ success: false });
				}
			})
			.catch((err) => {
				console.log(err);
				res.sendStatus(400);
			});
	});
});

router.get('/reset/:token', (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() }
	})
		.then((user) => {
			if (user) {
				console.log('reset token matched!');
				res.json({ success: true, userId: user._id });
			} else {
				console.log('reset token did not match!');
				res.json({ success: false });
			}
		})
		.catch((err) => {
			console.log('something went wrong with finding the user!');
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/new-password', (req, res, next) => {
	const { password, id, token } = req.body;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
		_id: id
	})
		.then(async (user) => {
			if (user) {
				console.log('matched user!');
				const encryptedPassword = await bcrypt.hash(password, 12);
				user.password = encryptedPassword;
				user.resetToken = undefined;
				user.resetTokenExpiration = undefined;
				await user.save();
				res.json({ success: true });
			} else {
				console.log('valid user not found!');
				res.json({ success: false });
			}
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
