const path = require('path');
const express = require('express');
const router = express.Router();

const Product = require('../model/product');
const Cart = require('../model/cart');

router.get('/', (req, res, next) => {
	console.log('SHOP!!');
	res.json(Product.fetchAll());
});

router.get('/products', (req, res, next) => {
	console.log('SHOP!!');
	res.json(Product.fetchAll());
});

router.get('/products/:productId', (req, res, next) => {
	const id = req.params.productId;
	res.json(Product.fetchId(id));
});

router.get('/cart', (req, res, next) => {
	const cart = Cart.getCartInfoRich();
	console.log(cart);
	res.json(cart);
});

router.post('/add-to-cart', (req, res, next) => {
	const prodId = req.body.id;
	const price = req.body.price;
	console.log(prodId);
	Cart.addProduct(prodId, price);
	console.log(Cart.cart);
	res.sendStatus(200);
});

router.post('/edit-cart', (req, res, next) => {
	const { id, price, quantity } = req.body;
	if (parseInt(quantity) > 0) {
		Cart.editQuantity(id, price, quantity);
	} else {
		Cart.deleteProduct(id, price);
	}
	console.log(Cart.cart);
	res.json({ totalPrice: Cart.cart.totalPrice });
});

router.post('/delete-cart-item', (req, res, next) => {
	const { id, price } = req.body;
	Cart.deleteProduct(id, price);
	console.log(Cart.cart);
	res.json(Cart.getCartInfoRich());
});

module.exports = router;
