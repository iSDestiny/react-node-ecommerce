import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';
import {
	Grid,
	Divider,
	Typography,
	Button,
	TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	image: {
		width: '100%',
		height: '100%',
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
		height: '190px',
		width: '180px',
	},
	cartBody: {
		width: '100%',
		wordWrap: 'break-word',
	},
}));

const Cart = (props) => {
	const classes = useStyles();
	const [cart, setCart] = useState();
	const [idQty, setIdQty] = useState({});
	const [totalPrice, setTotalPrice] = useState(0);

	useEffect(() => {
		axios.get(backendDomain + '/shop/cart').then((res) => {
			setIdQty((prev) => {
				let newIdQty = { ...prev };
				res.data.products.forEach((prod) => {
					newIdQty[prod.productData.id] = prod.quantity;
				});
				return newIdQty;
			});
			setTotalPrice(res.data.totalPrice);
			setCart(res.data);
		});
	}, []);

	const deleteHandler = (id, price) => {
		axios
			.post(backendDomain + '/shop/delete-cart-item', {
				id: id,
				price: price,
			})
			.then((res) => {
				console.log(res);
				setCart(res.data);
				setTotalPrice(res.data.totalPrice);
				setIdQty((prev) => {
					let newIdQty = { ...prev };
					res.data.products.forEach((prod) => {
						newIdQty[prod.productData.id] = prod.quantity;
					});
					return newIdQty;
				});
			});
	};

	const handleQtyChange = (event, id, price) => {
		if (!event.target.value.includes('.')) {
			setIdQty((prev) => {
				let newIdQty = { ...prev };
				newIdQty[id] = event.target.value;
				return newIdQty;
			});
		}
		if (event.target.value && parseInt(event.target.value) <= 0) {
			deleteHandler(id, price);
		} else if (event.target.value && !event.target.value.includes('.'))
			axios
				.post(backendDomain + '/shop/edit-cart', {
					id: id,
					price: price,
					quantity: event.target.value,
				})
				.then((res) => {
					console.log(res);
					setTotalPrice(res.data.totalPrice);
				});
	};

	return (
		<>
			{cart && cart.products.length > 0 && (
				<Typography variant="h5" style={{ textAlign: 'center' }}>
					<strong>Total Price: ${totalPrice}</strong>
				</Typography>
			)}
			<Grid container spacing={3} direction="column">
				{cart && cart.products.length > 0 ? (
					cart.products.map((prod) => {
						const { productData } = prod;

						return (
							<Grid item key={productData.id}>
								<Grid
									container
									direction="row"
									spacing={2}
									style={{ marginBottom: '1rem' }}
								>
									<Grid item xs={3}>
										<div className={classes.image}>
											<img
												className={classes.img}
												src={productData.imageUrl}
												alt="product image"
											/>
										</div>
									</Grid>
									<Grid item xs={7}>
										<Grid
											container
											spacing={3}
											className={classes.cartBody}
										>
											<Grid item xs={12}>
												<Typography variant="h5">
													{productData.title}
												</Typography>
											</Grid>
											<Grid item>
												<TextField
													label="Qty"
													type="number"
													value={
														idQty[productData.id]
													}
													style={{ width: '2rem' }}
													onChange={(event) => {
														handleQtyChange(
															event,
															productData.id,
															productData.price
														);
													}}
												/>
											</Grid>
											<Grid item xs={2}>
												<Button
													variant="contained"
													color="secondary"
													onClick={() => {
														deleteHandler(
															productData.id,
															productData.price
														);
													}}
													style={{ height: '100%' }}
												>
													Delete
												</Button>
											</Grid>
										</Grid>
									</Grid>
									<Grid item style={{ marginLeft: 'auto' }}>
										<Typography variant="h6">
											<strong>
												$
												{productData.price *
													idQty[productData.id]}
											</strong>
										</Typography>
									</Grid>
								</Grid>
								<Divider />
							</Grid>
						);
					})
				) : (
					<Typography variant="h4" style={{ textAlign: 'center' }}>
						No products in the cart!
					</Typography>
				)}
			</Grid>
		</>
	);
};

export default Cart;
