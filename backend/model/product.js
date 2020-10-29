// const getDb = require('../utility/database').getDb;
// const mongo = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	imageUrl: {
		type: String,
		require: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

module.exports = mongoose.model('Product', productSchema);


// class Product {
// 	constructor(title, price, description, imageUrl, userId) {
// 		this.title = title;
// 		this.price = parseFloat(price);
// 		this.description = description;
// 		this.imageUrl = imageUrl;
// 		this.userId = userId;
// 	}

// 	save() {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.insertOne(this)
// 			.then((res) => {
// 				console.log(res);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}

// 	static findById(prodId) {
// 		prodId = new mongo.ObjectID(prodId);
// 		const db = getDb();
// 		const query = { _id: prodId };
// 		return db.collection('products').findOne(query);
// 	}

// 	static fetchAll() {
// 		return getDb()
// 			.collection('products')
// 			.find()
// 			.toArray()
// 			.then((products) => {
// 				console.log(products);
// 				return products;
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	}

// 	static deleteById(prodId) {
// 		prodId = new mongo.ObjectID(prodId);
// 		const collection = getDb().collection('products');
// 		const query = { _id: prodId };
// 		return collection.deleteOne(query);
// 	}

// 	static editById(prodId, title, price, description, imageUrl) {
// 		prodId = new mongo.ObjectID(prodId);
// 		const collection = getDb().collection('products');
// 		const filter = { _id: prodId };
// 		const options = { upsert: true };
// 		const updateDoc = {
// 			$set: {
// 				title: title,
// 				price: price,
// 				description: description,
// 				imageUrl: imageUrl,
// 			},
// 		};
// 		return collection.updateOne(filter, updateDoc, options);
// 	}
// }

