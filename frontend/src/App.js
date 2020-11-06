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
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userId, setUserId] = useState();
	const [token, setToken] = useState();
	// const [fetchDone, setFetchDone] = useState(false);

	const logoutHandler = () => {
		setToken(null);
		setUserId(null);
		setIsAuthenticated(false);
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('expiryDate');
	};

	const autoLogout = (time) => {
		setTimeout(() => {
			logoutHandler();
		}, time);
	};

	useEffect(() => {
		const expiryDate = localStorage.getItem('expiryDate');
		const storageToken = localStorage.getItem('token');
		if (!storageToken || !expiryDate) return;
		if (expiryDate <= new Date()) {
			logoutHandler();
			return;
		}
		setUserId(localStorage.getItem('userId'));
		setToken(storageToken);
		setIsAuthenticated(true);
		autoLogout(new Date(expiryDate).getTime() - new Date().getTime());
	}, []);

	const adminProducts = (
		<Shop
			pageType={2}
			token={token}
			userId={userId}
			isAuthenticated={isAuthenticated}
		/>
	);

	return (
		<Router>
			<Route path="/">
				<NavBar
					isAuthenticated={isAuthenticated}
					logoutHandler={logoutHandler}
				/>
			</Route>
			<Container maxWidth="lg" style={{ paddingTop: '50px' }}>
				<Switch>
					<Route exact path="/">
						<Shop
							isAuthenticated={isAuthenticated}
							token={token}
							pageType={0}
						/>
					</Route>
					<Route exact path="/products">
						<Shop pageType={1} isAuthenticated={isAuthenticated} />
					</Route>
					<Route path="/products/:id">
						<Product
							token={token}
							isAuthenticated={isAuthenticated}
						/>
					</Route>
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/cart"
					>
						<Cart token={token} />
					</AuthenticatedRoute>
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/orders"
					>
						<Orders token={token} />
					</AuthenticatedRoute>
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/add-product"
					>
						<AddProduct token={token} />
					</AuthenticatedRoute>
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/admin-products"
					>
						{adminProducts}
					</AuthenticatedRoute>
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/edit-product/:id"
					>
						<AddProduct edit token={token} />
					</AuthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/login"
					>
						<Login
							setUserId={setUserId}
							setToken={setToken}
							setIsAuthenticated={setIsAuthenticated}
							isAuthenticated={isAuthenticated}
							autoLogout={autoLogout}
						/>
					</UnauthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/signup"
					>
						<SignUp />
					</UnauthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						exact
						path="/reset"
					>
						<Reset />
					</UnauthenticatedRoute>
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						path="/reset/:token"
					>
						<UpdatePassword />
					</UnauthenticatedRoute>
					<Route component={PageNotFound} />
				</Switch>
			</Container>
		</Router>
	);
};

export default App;
