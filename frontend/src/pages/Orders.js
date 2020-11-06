import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Link } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';

const Orders = (props) => {
	const [orders, setOrders] = useState([]);
	const { token } = props;
	const history = useHistory();

	useEffect(() => {
		axios
			.get(backendDomain + '/shop/orders', {
				headers: { Authorization: 'Bearer ' + token }
			})
			.then((res) => {
				console.log(res.data);
				setOrders(res.data);
			})
			.catch((err) => {
				console.log(err);
				if (err.response.status === 401) history.push('/login');
				else history.push('/500');
			});
	}, []);

	const fetchInvoice = (id) => {
		axios
			.get(`${backendDomain}/shop/invoice/${id}`, {
				headers: { Authorization: 'Bearer ' + token },
				responseType: 'blob'
			})
			.then((res) => {
				console.log(res);
				const file = window.URL.createObjectURL(res.data);
				window.open(file, '_blank');
			});
	};

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
							<Link
								onClick={() => {
									fetchInvoice(order._id);
								}}
							>
								Invoice
							</Link>
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
