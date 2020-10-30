import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';

const Orders = (props) => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		axios
			.get(backendDomain + '/shop/orders', { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				setOrders(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<Grid container alignItems="center" direction="column">
			{orders.length > 0 ? (
				orders.map((order) => {
					const productDisplay = order.products.map((product) => {
						return (
							<Grid item key={product._id}>
								<Typography variant="body1">
									{product.title} - {product.quantity}
								</Typography>
							</Grid>
						);
					});
					return (
						<Grid
							item
							container
							key={order._id}
							justify="center"
							alignItems="center"
							direction="column"
						>
							<Typography variant="h5">
								Order # {order._id}
							</Typography>
							<Typography variant="h6">
								Total Price: ${order.totalPrice}
							</Typography>
							{productDisplay}
						</Grid>
					);
				})
			) : (
				<Typography variant="h3">There are no orders!</Typography>
			)}
		</Grid>
	);
};

export default Orders;
