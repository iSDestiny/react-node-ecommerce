import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, Container } from '@material-ui/core';

const NavBar = (props) => {
	const tabs = [
		'/',
		'/products',
		'/cart',
		'/orders',
		'/add-product',
		'/admin-products',
	];
	const location = useLocation();
	return (
		<div>
			<AppBar position="static" color="default">
				<Container>
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
						/>
						<Tab
							label="Products"
							value={tabs[1]}
							component={Link}
							to={tabs[1]}
						/>
						<Tab
							label="Cart"
							value={tabs[2]}
							component={Link}
							to={tabs[2]}
						/>
						<Tab
							label="Orders"
							value={tabs[3]}
							component={Link}
							to={tabs[3]}
						/>
						<Tab
							label="Add Product"
							value={tabs[4]}
							component={Link}
							to={tabs[4]}
						/>
						<Tab
							label="Admin Products"
							value={tabs[5]}
							component={Link}
							to={tabs[5]}
						/>
					</Tabs>
				</Container>
			</AppBar>
		</div>
	);
};

export default NavBar;
