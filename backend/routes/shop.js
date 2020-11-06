const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const isAuth = require('../middleware/isAuth');

const Product = require('../model/product');
const User = require('../model/user');
const Order = require('../model/orders');

router.get('/products', (req, res, next) => {
	const page = parseInt(req.query.page);
	const itemsPerPage = parseInt(req.query.items);
	console.log(page, itemsPerPage);
	Product.find()
		.skip((page - 1) * itemsPerPage)
		.limit(itemsPerPage)
		.then((products) => {
			// console.log(products);
			res.json(products);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.get('/admin-products', isAuth, (req, res, next) => {
	const page = parseInt(req.query.page);
	const itemsPerPage = parseInt(req.query.items);
	Product.find({ userId: req.userId })
		.skip((page - 1) * itemsPerPage)
		.limit(itemsPerPage)
		.then((products) => {
			console.log(products);
			res.json(products);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.get('/products/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.then((product) => {
			if (!product) throw new Error('Product not found');
			console.log(product);
			res.json(product);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.get('/cart', isAuth, async (req, res, next) => {
	const user = await User.findById(req.userId);
	if (!user) throw Error();
	user.getCart()
		.then((cart) => {
			res.json(cart);
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
});

router.post('/add-to-cart', isAuth, async (req, res, next) => {
	const prodId = req.body.id;
	try {
		const product = await Product.findById(prodId);
		const user = await User.findById(req.userId);
		await user.addToCart(product);
		console.log('Successfully added to cart');
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.put('/edit-cart', isAuth, async (req, res, next) => {
	try {
		let { id, quantity } = req.body;
		quantity = parseInt(quantity);
		const user = await User.findById(req.userId);
		if (!user) throw new Error('User not found');
		await user.editCartProductQuantityById(id, quantity);
		const cart = await user.getCart();
		res.json(cart);
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.delete('/cart-item/:id', isAuth, async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(req.userId);
		if (!user) throw new Error('User not found');
		await user.deleteCartProductById(id);
		const cart = await user.getCart();
		res.json(cart);
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.get('/orders', isAuth, (req, res, next) => {
	Order.find({ 'user._id': req.userId })
		.then((orders) => {
			res.json(orders);
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

router.post('/create-order', isAuth, async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) throw new Error('User not found');
		const cart = await user.getCart();
		if (!cart) throw new Error('Cart not found');
		const order = new Order({
			products: [...cart.products],
			totalPrice: cart.totalPrice,
			user: { _id: req.userId }
		});

		await order.save();
		user.cart = { items: [] };
		user.save()
			.then(() => {
				console.log('added order and cleared cart!');
				res.sendStatus(200);
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.get('/invoice/:orderId', isAuth, (req, res, next) => {
	const orderId = req.params.orderId;

	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error('No order found'));
			}
			if (order.user._id.toString() !== req.userId.toString()) {
				return next(new Error('Unauthorized'));
			}
			const invoiceName = `invoice-${orderId}.pdf`;
			const invoicePath = path.join('data', 'invoices', invoiceName);
			const pdfDoc = new PDFDocument();
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader(
				'Content-Disposition',
				`inline; filename="${invoiceName}"`
			);
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);
			pdfDoc.fontSize(26).text('Invoice', { underline: true });
			pdfDoc.text('------------------------');
			pdfDoc.fontSize(14);
			order.products.forEach((prod) => {
				pdfDoc.text(
					`${prod.title} - ${prod.quantity} x $${prod.price}`
				);
			});
			pdfDoc.fontSize(26).text('------------------------');
			pdfDoc.fontSize(20).text(`Total Price: $${order.totalPrice}`);
			pdfDoc.end();

			// const file = fs.createReadStream(invoicePath);

			// file.pipe(res);
		})
		.catch((err) => {
			console.log(err);
			next(new Error('Something went wrong'));
		});
});

module.exports = router;
