import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, Button} from '@material-ui/core';

const NavBar = (props) => {
	const tabs = [
		'/',
		'/products',
		'/cart',
		'/orders',
		'/add-product',
		'/admin-products',
		'/login'
	];
	const location = useLocation();
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
							style={{minWidth: '100px'}}
						/>
						<Tab
							label="Products"
							value={tabs[1]}
							component={Link}
							to={tabs[1]}
							style={{minWidth: '100px'}}
						/>
						<Tab
							label="Cart"
							value={tabs[2]}
							component={Link}
							to={tabs[2]}
							style={{minWidth: '100px'}}
						/>
						<Tab
							label="Orders"
							value={tabs[3]}
							component={Link}
							to={tabs[3]}
							style={{minWidth: '100px'}}
						/>
						<Tab
							label="Add Product"
							value={tabs[4]}
							component={Link}
							to={tabs[4]}
							style={{minWidth: '100px'}}
						/>
						<Tab
							label="Admin Products"
							value={tabs[5]}
							component={Link}
							to={tabs[5]}
						/>
						<Tab label="Login" style={{marginLeft: 'auto'}} value={tabs[6]} component={Link} to={tabs[6]}/>
					</Tabs>
			</AppBar>
		</div>
	);
};

export default NavBar;
