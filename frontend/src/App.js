import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useLocation
} from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import { Container, Grid } from '@material-ui/core';
import AddProduct from './pages/AddProduct';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import backendDomain from './utility/backendDomain';

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
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
			<NavBar
				isAuthenticated={isAuthenticated}
				setIsAuthenticated={setIsAuthenticated}
			/>
			<Container maxWidth="lg" style={{ paddingTop: '50px' }}>
				<Switch>
					<Route exact path="/">
						<Shop
							isAuthenticated={isAuthenticated}
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
						<Product isAuthenticated={isAuthenticated} />
					</Route>
					<Route path="/cart">
						<Cart />
					</Route>
					<Router path="/orders">
						<Orders />
					</Router>
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
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/signup">
						<SignUp />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
};

export default App;
