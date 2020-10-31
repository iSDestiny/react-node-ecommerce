import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, Button } from '@material-ui/core';

const NavBar = (props) => {
	const tabs = [
		'/',
		'/products',
		'/cart',
		'/orders',
		'/add-product',
		'/admin-products',
		'/login',
		'/signup'
	];

	const { isAuthenticated, setIsAuthenticated, setFetchDone } = props;
	const location = useLocation();

	useEffect(() => {
		axios
			.get(backendDomain + '/auth/authenticated', {
				withCredentials: true
			})
			.then((res) => {
				console.log('authentication!!');
				console.log(res.data.isAuthenticated);
				setIsAuthenticated(res.data.isAuthenticated);
				setFetchDone(true);
			})
			.catch((err) => {
				console.log('failed to get authentication');
			});
	}, [location.pathname]);

	const logoutHandler = () => {
		axios
			.post(
				backendDomain + '/auth/logout',
				{ _csrf: props.csrfToken },
				{ withCredentials: true }
			)
			.then((res) => {
				console.log('logout success!!');
				setIsAuthenticated(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const adminOnlyCommands = isAuthenticated
		? [
				<Tab
					label="Cart"
					value={tabs[2]}
					component={Link}
					to={tabs[2]}
					key={2}
					style={{ minWidth: '100px' }}
				/>,
				<Tab
					label="Orders"
					value={tabs[3]}
					component={Link}
					to={tabs[3]}
					key={3}
					style={{ minWidth: '100px' }}
				/>,
				<Tab
					label="Add Product"
					value={tabs[4]}
					component={Link}
					to={tabs[4]}
					key={4}
					style={{ minWidth: '100px' }}
				/>,
				<Tab
					label="Admin Products"
					value={tabs[5]}
					component={Link}
					to={tabs[5]}
					key={5}
				/>
		  ]
		: null;

	const loggedOutTabs = !isAuthenticated
		? [
				<Tab
					label="Login"
					style={{ marginLeft: 'auto', minWidth: '100px' }}
					value={tabs[6]}
					key={6}
					component={Link}
					to={tabs[6]}
				/>,
				<Tab
					label="Sign Up"
					style={{ minWidth: '100px' }}
					value={tabs[7]}
					key={7}
					component={Link}
					to={tabs[7]}
				/>
		  ]
		: null;

	const logOutButton = isAuthenticated ? (
		<Tab
			label="Log Out"
			style={{ marginLeft: 'auto' }}
			onClick={logoutHandler}
		/>
	) : null;
	return (
		<div>
			<AppBar position="static" color="default">
				<Tabs
					value={
						tabs.includes(location.pathname)
							? location.pathname
							: false
					}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab
						label="Shop"
						value={tabs[0]}
						component={Link}
						to={tabs[0]}
						style={{ minWidth: '100px' }}
					/>
					<Tab
						label="Products"
						value={tabs[1]}
						component={Link}
						to={tabs[1]}
						style={{ minWidth: '100px' }}
					/>

					{adminOnlyCommands}
					{loggedOutTabs}
					{logOutButton}
				</Tabs>
			</AppBar>
		</div>
	);
};

export default NavBar;
