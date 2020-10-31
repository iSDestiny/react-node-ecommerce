const mongodb = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const getDb = require('../utility/database').getDb;

const userSchema = new Schema({
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	resetToken: String,
	resetTokenExpiration: Date,
	cart: {
		items: [
			{
				_id: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: 'Product'
				},
				quantity: { type: Number, required: true }
			}
		]
	}
});

userSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp._id.toString() === product._id.toString();
	});

	if (cartProductIndex >= 0) {
		this.cart.items[cartProductIndex].quantity += 1;
	} else {
		this.cart.items.push({
			_id: product._id,
			quantity: 1
		});
	}
	return this.save();
};

userSchema.methods.getCart = function () {
	return this.populate('cart.items._id')
		.execPopulate()
		.then((user) => {
			let products = user.cart.items;
			let totalPrice = 0;
			products = products.map((product) => {
				totalPrice += product._id.price * product.quantity;
				const productData = product._id;
				return {
					_id: productData._id,
					title: productData.title,
					imageUrl: productData.imageUrl,
					price: productData.price,
					description: productData.description,
					quantity: product.quantity
				};
			});
			return { products: products, totalPrice: totalPrice };
		});
};

userSchema.methods.editCartProductQuantityById = function (id, quantity) {
	const index = this.cart.items.findIndex(
		(cp) => cp._id.toString() === id.toString()
	);
	this.cart.items[index].quantity = quantity;
	return this.save();
};

userSchema.methods.deleteCartProductById = function (id) {
	this.cart.items = this.cart.items.filter(
		(cp) => cp._id.toString() !== id.toString()
	);
	return this.save();
};

module.exports = mongoose.model('User', userSchema);

// class User {
// 	constructor(name, email, cart, id) {
// 		this.name = name;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = new mongodb.ObjectId(id);
// 	}

// 	save() {
// 		const collection = getDb().collection('users');
// 		return collection.insertOne(this);
// 	}

// 	async getCart() {
// 		const collection = getDb().collection('products');
// 		const indexes = this.cart.items.map((cp) => {
// 			return cp.productId;
// 		});
// 		let totalPrice = 0;
// 		let products = await collection
// 			.find({ _id: { $in: indexes } })
// 			.toArray();
// 		if (products.length < indexes.length) {
// 			let productIndexes = products.map((prod) => prod._id.toString());
// 			productIndexes = new Set(productIndexes);
// 			this.cart.items = this.cart.items.filter((cp) =>
// 				productIndexes.has(cp.productId)
// 			);
// 			await getDb()
// 				.collection('users')
// 				.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
// 		}
// 		products = products.map((prod) => {
// 			const item = this.cart.items.find(
// 				(cp) => cp.productId.toString() === prod._id.toString()
// 			);
// 			const quantity = item.quantity;
// 			const product = { ...prod, quantity: quantity };
// 			totalPrice += quantity * prod.price;
// 			return product;
// 		});
// 		return { products: products, totalPrice: totalPrice };
// 	}

// 	addToCart(product) {
// 		const cartProductIndex = this.cart.items.findIndex((cp) => {
// 			return cp.productId.toString() === product._id.toString();
// 		});

// 		if (cartProductIndex >= 0) {
// 			this.cart.items[cartProductIndex].quantity += 1;
// 		} else {
// 			this.cart.items.push({
// 				productId: new mongodb.ObjectId(product._id),
// 				quantity: 1,
// 			});
// 		}

// 		const updatedCart = {
// 			items: this.cart.items,
// 		};

// 		const collections = getDb().collection('users');
// 		return collections.updateOne(
// 			{ _id: this._id },
// 			{ $set: { cart: updatedCart } }
// 		);
// 	}

// 	editCartProductQuantityById(id, quantity) {
// 		const collection = getDb().collection('users');
// 		const productIndex = this.cart.items.findIndex(
// 			(cp) => cp.productId.toString() === id.toString()
// 		);
// 		this.cart.items[productIndex].quantity = quantity;
// 		return collection.updateOne(
// 			{ _id: this._id },
// 			{ $set: { cart: { items: this.cart.items } } }
// 		);
// 	}

// 	deleteCartProductById(id) {
// 		const collection = getDb().collection('users');
// 		this.cart.items = this.cart.items.filter(
// 			(cp) => cp.productId.toString() !== id.toString()
// 		);
// 		return collection.updateOne(
// 			{ _id: this._id },
// 			{ $set: { cart: { items: this.cart.items } } }
// 		);
// 	}

// 	async addOrder() {
// 		const orderCollection = getDb().collection('orders');
// 		const { products, totalPrice } = await this.getCart();
// 		const order = {
// 			products: products,
// 			totalPrice: totalPrice,
// 			user: {
// 				_id: new mongodb.ObjectId(this._id),
// 				name: this.name,
// 			},
// 		};
// 		await orderCollection.insertOne(order);
// 		this.cart = { items: [] };
// 		const userCollection = await getDb().collection('users');
// 		return userCollection.updateOne(
// 			{ _id: this._id },
// 			{ $set: { cart: this.cart } }
// 		);
// 	}

// 	getOrders() {
// 		return getDb()
// 			.collection('orders')
// 			.find({ 'user._id': new mongodb.ObjectId(this._id) })
// 			.toArray();
// 	}

// 	static findById(userId) {
// 		const collection = getDb().collection('users');
// 		const query = { _id: mongodb.ObjectID(userId) };
// 		return collection.findOne(query);
// 	}
// }

// module.exports = User;
