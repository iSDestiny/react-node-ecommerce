const express = require('express');
const router = express.Router();

const Product = require('../model/product');
const Order = require('../model/orders');

router.get('/products', (req, res, next) => {
	Product.find({}).exec()
		.then((products) => {
			res.json(products);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.get('/products/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.then((product) => {
			console.log(product);
			res.json(product);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.get('/cart', (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => {
			res.json(cart);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/add-to-cart', async (req, res, next) => {
	const prodId = req.body.id;

	try {
		const product = await Product.findById(prodId);
		await req.user.addToCart(product);
		console.log('Successfully added to cart');
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

router.post('/edit-cart', async (req, res, next) => {
	try {
		let { id, quantity } = req.body;
		quantity = parseInt(quantity);
		await req.user.editCartProductQuantityById(id, quantity);
		const cart = await req.user.getCart();
		res.json(cart);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

router.post('/delete-cart-item', async (req, res, next) => {
	try {
		const { id } = req.body;
		await req.user.deleteCartProductById(id);
		const cart = await req.user.getCart();
		res.json(cart);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

router.get('/orders', (req, res, next) => {
	Order.find({'user._id': req.user._id}).exec()
		.then((orders) => {
			res.json(orders);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/create-order', async (req, res, next) => {
	const cart = await req.user.getCart();
	const order = new Order({products: [...cart.products], totalPrice: cart.totalPrice, user: {name: req.user.name, _id: req.user}});
	await order.save();
	req.user.cart = {items: []};
	req.user.save()
		.then(() => {
			console.log('added order and cleared cart!');
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
