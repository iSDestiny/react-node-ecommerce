// const Product = require('./product');
const Sequelize = require('sequelize');
const sequelize = require('../utility/database');

const Cart = sequelize.define('cart', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

// class Cart {
// 	static cart = { products: [], totalPrice: 0 };

// 	static addProduct(id, price) {
// 		const existingProductIndex = this.cart.products.findIndex(
// 			(prod) => prod.id === id
// 		);
// 		let updatedProduct;
// 		if (existingProductIndex > -1) {
// 			console.log(existingProductIndex);
// 			this.cart.products[existingProductIndex].qty++;
// 		} else {
// 			updatedProduct = { id: id, qty: 1 };
// 			this.cart.products.push(updatedProduct);
// 		}
// 		this.cart.totalPrice += parseFloat(price);
// 	}

// 	static deleteProduct(id, price) {
// 		price = parseFloat(price);
// 		const toDelete = this.cart.products.find((prod) => prod.id === id);
// 		if (toDelete) {
// 			this.cart.products = this.cart.products.filter(
// 				(prod) => prod.id !== id
// 			);
// 			this.cart.totalPrice -= price * toDelete.qty;
// 		}
// 	}

// 	static getCartInfoRich() {
// 		const cartIds = new Set(this.cart.products.map((prod) => prod.id));
// 		const products = Product.fetchAll().then((res) => {
// 			res.rows
// 				.filter((prod) => cartIds.has(prod.id))
// 				.map((prod) => {
// 					const qty = this.cart.products.find(
// 						(cProd) => cProd.id === prod.id
// 					).qty;
// 					return { productData: prod, quantity: qty };
// 				});
// 		});
// 		return { products: products, totalPrice: this.cart.totalPrice };
// 	}

// 	static editQuantity(id, price, quantity) {
// 		price = parseFloat(price);
// 		quantity = parseInt(quantity);
// 		const index = this.cart.products.findIndex((prod) => prod.id === id);
// 		this.cart.totalPrice -= this.cart.products[index].qty * price;
// 		this.cart.products[index].qty = quantity;
// 		this.cart.totalPrice += quantity * price;
// 	}

// 	static editPrice(id, prevPrice, newPrice) {
// 		prevPrice = parseFloat(prevPrice);
// 		newPrice = parseFloat(newPrice);
// 		const quantity = this.cart.products.find((prod) => prod.id === id).qty;
// 		this.cart.totalPrice -= prevPrice * quantity;
// 		this.cart.totalPrice += newPrice * quantity;
// 	}
// }

module.exports = Cart;
