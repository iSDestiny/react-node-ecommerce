import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';

const Shop = (props) => {
	const history = useHistory();

	useEffect(() => {
		axios
			.get(backendDomain + '/shop/products', { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				props.setProducts(res.data);
			});
	}, []);

	const addToCartHandler = (id, price) => {
		axios
			.post(
				backendDomain + '/shop/add-to-cart',
				{ id: id, price: price },
				{ withCredentials: true }
			)
			.then((res) => {
				console.log(res);
			});
	};

	const deleteHandler = (id, price) => {
		axios
			.post(
				backendDomain + '/admin/delete-product',
				{ id: id },
				{ withCredentials: true }
			)
			.then((res) => {
				console.log(res);
				props.setProducts((prev) => {
					return prev.filter((prod) => prod._id !== id);
				});
			});
	};
	return (
		<Grid container spacing={4} justify="center">
			{props.products.length > 0 ? (
				props.products.map((item) => {
					let buttons = null;

					switch (props.pageType) {
						case 0:
							buttons = props.isAuthenticated && (
								<Button
									color="primary"
									variant="outlined"
									onClick={(event) => {
										addToCartHandler(item._id, item.price);
									}}
									style={{ marginTop: '1rem' }}
								>
									Add to Cart
								</Button>
							);
							break;
						case 1:
							buttons = (
								<Button
									color="primary"
									variant="outlined"
									component={Link}
									to={`/products/${item._id}`}
									style={{
										marginTop: '1rem',
										marginLeft: '0.5rem'
									}}
								>
									Details
								</Button>
							);
							break;
						case 2:
							buttons = (
								<>
									<Button
										color="primary"
										variant="outlined"
										component={Link}
										to={`/edit-product/${item._id}`}
										style={{
											marginTop: '1rem',
											marginLeft: '0.5rem'
										}}
									>
										Edit
									</Button>
									<Button
										color="primary"
										variant="outlined"
										onClick={() => {
											deleteHandler(item._id, item.price);
										}}
										style={{
											marginTop: '1rem',
											marginLeft: '0.5rem'
										}}
									>
										Delete
									</Button>
								</>
							);
					}

					return (
						<Grid item xs={12} md={6} key={item._id}>
							<Paper
								elevation={2}
								style={{ padding: '10px', textAlign: 'center' }}
							>
								<Typography
									variant="h4"
									style={{ marginBottom: '1rem' }}
								>
									{item.title}
								</Typography>
								<img
									src={item.imageUrl}
									alt="Image of the product"
									style={{ width: '75%%', height: '250px' }}
								/>
								<Typography variant="h5">
									${item.price}
								</Typography>
								<Typography variant="body1">
									{item.description}
								</Typography>
								{buttons}
							</Paper>
						</Grid>
					);
				})
			) : (
				<Typography variant="h3">There are no products!</Typography>
			)}
		</Grid>
	);
};

export default Shop;
