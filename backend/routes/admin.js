const express = require('express');
const router = express.Router();

const Product = require('../model/product');

router.post('/add-product', (req, res, next) => {
	const { title, image, price, description } = req.body;

	const product = new Product({
		title: title,
		imageUrl: image,
		price: price,
		description: description,
		userId: req.session.user._id
	});
	product
		.save()
		.then((result) => {
			console.log('created product!');
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/edit-product', (req, res, next) => {
	const { id, title, image, price, description } = req.body;
	Product.findById(id)
		.then(async (product) => {
			if (product.userId.toString() === req.user._id.toString()) {
				product.title = title;
				product.imageUrl = image;
				product.description = description;
				product.price = price;
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
		.then((result) => {
			console.log('successful delete!');
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
