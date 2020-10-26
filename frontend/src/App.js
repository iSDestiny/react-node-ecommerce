import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import { Container, Grid } from '@material-ui/core';
import AddProduct from './pages/AddProduct';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';

function App() {
	const [products, setProducts] = useState([]);

	const selectTab = (tab) => {
		switch (tab) {
			case 0:
				return <Shop products={products} setProducts={setProducts} />;
			case 4:
				return <AddProduct setProduct={setProducts} />;
		}
	};

	return (
		<Router>
			<NavBar />
			<Container maxWidth="lg" style={{ paddingTop: '50px' }}>
				<Switch>
					<Route exact path="/">
						<Shop
							pageType={0}
							products={products}
							setProducts={setProducts}
						/>
					</Route>
					<Route exact path="/products">
						<Shop
							pageType={1}
							products={products}
							setProducts={setProducts}
						/>
					</Route>
					<Route path="/products/:id">
						<Product />
					</Route>
					<Route path="/cart">
						<Cart />
					</Route>
					<Route path="/add-product">
						<AddProduct />
					</Route>
					<Route path="/admin-products">
						<Shop
							pageType={2}
							products={products}
							setProducts={setProducts}
						/>
					</Route>
					<Route path="/edit-product/:id">
						<AddProduct edit />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
}

export default App;
