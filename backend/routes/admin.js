const path = require('path');
const express = require('express');
const router = express.Router();

const Product = require('../model/product');
const Cart = require('../model/cart');
const { title } = require('process');

router.get('/products', (req, res, next) => {
	console.log(Product.fetchAll());
	res.json(Product.fetchAll());
});

router.post('/add-product', (req, res, next) => {
	const { title, image, price, description } = req.body;
	const newProduct = new Product(title, image, description, price);
	newProduct.save();
	res.sendStatus(200);
});

router.post('/edit-product', (req, res, next) => {
	const { id, title, image, price, description } = req.body;
	const existingProduct = Product.fetchId(id);
	const prevPrice = existingProduct.editProduct(
		title,
		image,
		description,
		price
	);
	Cart.editPrice(id, prevPrice, existingProduct.price);
	res.sendStatus(200);
});

router.post('/delete-product', (req, res, next) => {
	const { id, price } = req.body;
	Product.deleteId(id);
	Cart.deleteProduct(id, price);
	console.log(Product.fetchAll());
	console.log(Cart.cart);
	res.sendStatus(200);
});

module.exports = router;
