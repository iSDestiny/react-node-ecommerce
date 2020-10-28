const express = require('express');
const router = express.Router();

const Product = require('../model/product');

router.get('/products', (req, res, next) => {
	Product.fetchAll()
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
			console.log(cart);
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
	req.user
		.getOrders()
		.then((orders) => {
			res.json(orders);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/create-order', (req, res, next) => {
	req.user
		.addOrder()
		.then(() => {
			console.log('added order');
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
