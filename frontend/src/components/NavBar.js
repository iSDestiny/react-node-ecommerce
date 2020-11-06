import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';

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

	const { isAuthenticated, logoutHandler } = props;
	const location = useLocation();

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
