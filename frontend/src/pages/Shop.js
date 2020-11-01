import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
// 	fade: {
// 		position: 'relative',
// 		height: '3.6em',
// 		'&::after': {
// 			content: '""',
// 			textAlign: 'right',
// 			position: 'absolute',
// 			bottom: 0,
// 			right: 0,
// 			width: '70%',
// 			height: '1.2em',
// 			background:
// 				'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)'
// 		}
// 	}
// }));
const Shop = (props) => {
	const history = useHistory();
	// const classes = useStyles();

	useEffect(() => {
		const route =
			props.pageType === 2 ? '/shop/admin-products' : '/shop/products';
		axios
			.get(backendDomain + route, { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				props.setProducts(res.data);
			});
	}, []);

	const addToCartHandler = (id, price) => {
		axios
			.post(
				backendDomain + '/shop/add-to-cart',
				{ id: id, _csrf: props.csrfToken },
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
				{ id: id, _csrf: props.csrfToken },
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
					let buttons = 'xd';
					console.log(props.pageType);
					switch (props.pageType) {
						case 0:
							buttons = props.isAuthenticated && (
								<Button
									color="primary"
									variant="outlined"
									onClick={() => {
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
							break;
					}
					console.log('buttons ' + buttons);
					return (
						<Grid item xs={12} md={6} key={item._id}>
							<Paper
								elevation={2}
								style={{
									padding: '10px',
									textAlign: 'center'
								}}
							>
								<Typography
									variant="h4"
									style={{ marginBottom: '1rem' }}
								>
									{item.title}
								</Typography>
								<div styles={{ width: '100%', height: '100%' }}>
									<img
										src={item.imageUrl}
										alt="Image of the product"
										style={{
											margin: 'auto',
											display: 'block',
											maxWidth: '100%',
											maxHeight: '100%',
											height: '200px',
											width: 'auto'
										}}
									/>
								</div>
								<Typography
									variant="h5"
									style={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									}}
								>
									${item.price}
								</Typography>
								<Typography
									variant="body1"
									style={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									}}
								>
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
