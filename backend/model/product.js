let products = [];

class Product {
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
		this.id = Math.random().toString();
	}

	save() {
		products.push(this);
	}

	static fetchAll() {
		return products;
	}

	static fetchId(id) {
		return products.find((prod) => {
			return prod.id === id;
		});
	}

	static deleteId(id) {
		products = products.filter((prod) => id !== prod.id);
	}

	editProduct(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		const prevPrice = this.price;
		this.price = price;
		return prevPrice;
	}
}

module.exports = Product;
