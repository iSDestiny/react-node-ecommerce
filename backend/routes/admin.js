const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Product = require('../model/product');
const User = require('../model/user');

const productValidators = [
	body('title', 'Must be alphanumeric and at least 3 characters long')
		.trim()
		.matches(/^[a-z0-9 ]+$/i)
		.isLength({ min: 3 }),
	body('image', 'Must be a valid url').trim().isURL(),
	body('price', 'Must be a decimal').trim().isFloat(),
	body('description', 'Must be at least 5 characters long')
		.trim()
		.isLength({ min: 5 })
];

router.post('/add-product', productValidators, (req, res, next) => {
	const { title, image, price, description } = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.json({ allErrors: errors.array() });
	}

	const product = new Product({
		title: title.trim(),
		imageUrl: image.trim(),
		price: price.trim(),
		description: description.trim(),
		userId: req.session.user._id
	});
	product
		.save()
		.then(() => {
			console.log('created product!');
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/edit-product', productValidators, (req, res, next) => {
	const { id, title, image, price, description } = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.json({ allErrors: errors.array() });
	}
	Product.findById(id)
		.then(async (product) => {
			if (product.userId.toString() === req.user._id.toString()) {
				product.title = title.trim();
				product.imageUrl = image.trim();
				product.description = description.trim();
				product.price = price.trim();
				await product.save();
				console.log('successful edit!');
				res.json({ success: true });
			} else {
				console.log(
					'this user does not have permission to edit the product!'
				);
				res.json({ success: false });
			}
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/delete-product', (req, res, next) => {
	const { id } = req.body;
	Product.findByIdAndRemove(id)
		.then(async () => {
			console.log('successful delete!');
			const users = await User.find({}).exec();
			users.forEach(async (user) => {
				const newItems = user.cart.items.filter(
					(cp) => id.toString() !== cp._id.toString()
				);
				user.cart = { items: newItems };
				await user.save();
			});
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
