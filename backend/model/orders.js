const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	products: [
		{
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
			quantity: {
				type: Number,
				require: true
			}
		}
	],
	totalPrice: {
		type: Number,
		require: true
	},
	user: {
		_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	}
});

module.exports = mongoose.model('Order', orderSchema);
