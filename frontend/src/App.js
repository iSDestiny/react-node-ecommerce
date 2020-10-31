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
import Reset from './pages/Reset';
import backendDomain from './utility/backendDomain';
import AuthenticatedRoute from './utility/AuthenticatedRoute';
import UnauthenticatedRoute from './utility/UnauthenticatedRoute';
import UpdatePassword from './pages/UpdatePassword';
import PageNotFound from './pages/PageNotFound';

const App = () => {
	const [csrfToken, setCsrfToken] = useState();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [products, setProducts] = useState([]);
	const [fetchDone, setFetchDone] = useState(false);

	useEffect(() => {
		axios
			.get(backendDomain + '/csrf', { withCredentials: true })
			.then((res) => {
				setCsrfToken(res.data.csrfToken);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const adminProducts = (
		<Shop
			pageType={2}
			products={products}
			setProducts={setProducts}
			csrfToken={csrfToken}
		/>
	);

	return (
		<Router>
			<Route path="/">
				<NavBar
					csrfToken={csrfToken}
					isAuthenticated={isAuthenticated}
					setIsAuthenticated={setIsAuthenticated}
					setFetchDone={setFetchDone}
				/>
			</Route>
			<Container maxWidth="lg" style={{ paddingTop: '50px' }}>
				<Switch>
					<Route exact path="/">
						<Shop
							csrfToken={csrfToken}
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
						<Product
							csrfToken={csrfToken}
							isAuthenticated={isAuthenticated}
						/>
					</Route>
					<AuthenticatedRoute
						fetchDone={fetchDone}
						isAuthenticated={isAuthenticated}
						path="/cart"
					>
						<Cart csrfToken={csrfToken} />
					</AuthenticatedRoute>
					<AuthenticatedRoute
						fetchDone={fetchDone}
						isAuthenticated={isAuthenticated}
						path="/orders"
					>
						<Orders />
					</AuthenticatedRoute>
					<AuthenticatedRoute
						fetchDone={fetchDone}
						isAuthenticated={isAuthenticated}
						path="/add-product"
					>
						<AddProduct csrfToken={csrfToken} />
					</AuthenticatedRoute>
					<AuthenticatedRoute
						fetchDone={fetchDone}
						isAuthenticated={isAuthenticated}
						path="/admin-products"
					>
						{adminProducts}
					</AuthenticatedRoute>
					<AuthenticatedRoute
						fetchDone={fetchDone}
						isAuthenticated={isAuthenticated}
						path="/edit-product/:id"
					>
						<AddProduct edit csrfToken={csrfToken} />
					</AuthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						fetchDone={fetchDone}
						path="/login"
					>
						<Login csrfToken={csrfToken} />
					</UnauthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						fetchDone={fetchDone}
						path="/signup"
					>
						<SignUp csrfToken={csrfToken} />
					</UnauthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						fetchDone={fetchDone}
						exact
						path="/reset"
					>
						<Reset csrfToken={csrfToken} />
					</UnauthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						fetchDone={fetchDone}
						path="/reset/:token"
					>
						<UpdatePassword csrfToken={csrfToken} />
					</UnauthenticatedRoute>
					<Route component={PageNotFound} />
				</Switch>
			</Container>
		</Router>
	);
};

export default App;
