import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import buildUrl from '../utility/buildUrl';
import {
	Grid,
	Divider,
	Typography,
	Button,
	TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	image: {
		width: '100%',
		height: '100%'
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '190px',
		height: 'auto',
		width: 'auto'
	},
	cartBody: {
		width: '100%',
		wordWrap: 'break-word'
	}
}));

const Cart = (props) => {
	const classes = useStyles();
	const [cart, setCart] = useState();
	const [idQty, setIdQty] = useState({});
	const [totalPrice, setTotalPrice] = useState(0);
	const history = useHistory();
	const { token } = props;

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_BACKEND_DOMAIN + '/shop/cart', {
				headers: { Authorization: 'Bearer ' + token }
			})
			.then((res) => {
				setIdQty((prev) => {
					let newIdQty = { ...prev };
					res.data.products.forEach((prod) => {
						newIdQty[prod._id] = prod.quantity;
					});
					return newIdQty;
				});
				setTotalPrice(res.data.totalPrice);
				setCart(res.data);
			});
	}, [token]);

	const deleteHandler = (id) => {
		axios
			.delete(
				process.env.REACT_APP_BACKEND_DOMAIN + `/shop/cart-item/${id}`,
				{
					headers: { Authorization: 'Bearer ' + token }
				}
			)
			.then((res) => {
				console.log('SUCCESSFUL DELETE');
				setCart(res.data);
				setTotalPrice(res.data.totalPrice);
				setIdQty((prev) => {
					let newIdQty = { ...prev };
					res.data.products.forEach((prod) => {
						newIdQty[prod._id] = prod.quantity;
					});
					return newIdQty;
				});
				console.log('SUCCESSFUL DELETE');
			})
			.catch((err) => {
				history.push('/500');
			});
	};

	const handleQtyChange = (event, id) => {
		if (!event.target.value.includes('.')) {
			setIdQty((prev) => {
				let newIdQty = { ...prev };
				newIdQty[id] = event.target.value;
				return newIdQty;
			});
		}
		if (event.target.value && parseInt(event.target.value) <= 0) {
			deleteHandler(id);
		} else if (event.target.value && !event.target.value.includes('.')) {
			axios
				.put(
					process.env.REACT_APP_BACKEND_DOMAIN + '/shop/edit-cart',
					{
						id: id,
						quantity: event.target.value
					},
					{ headers: { Authorization: 'Bearer ' + token } }
				)
				.then((res) => {
					console.log(res);
					setTotalPrice(res.data.totalPrice);
					setCart(res.data);
				});
		}
	};

	const orderHandler = () => {
		axios
			.post(
				process.env.REACT_APP_BACKEND_DOMAIN + '/shop/create-order',
				{},
				{ headers: { Authorization: 'Bearer ' + token } }
			)
			.then((res) => {
				console.log(res);
				history.push('/orders');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Grid container spacing={5} justify="center" direction="row">
			{cart && cart.products.length > 0 && (
				<Grid item>
					<Typography variant="h5">
						<strong>Total Price: ${totalPrice.toFixed(2)}</strong>
					</Typography>
				</Grid>
			)}
			{cart && cart.products.length > 0 ? (
				cart.products.map((prod) => {
					const productPrice = (prod.quantity * prod.price).toFixed(
						2
					);
					return (
						<Grid item key={prod._id} xs={12}>
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
											src={buildUrl(
												process.env
													.REACT_APP_BACKEND_DOMAIN,
												prod.imageUrl
											)}
											alt="product"
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
												{prod.title}
											</Typography>
										</Grid>
										<Grid item>
											<TextField
												label="Qty"
												type="number"
												value={idQty[prod._id]}
												style={{ width: '2rem' }}
												onChange={(event) => {
													handleQtyChange(
														event,
														prod._id
													);
												}}
											/>
										</Grid>
										<Grid item xs={2}>
											<Button
												variant="outlined"
												color="secondary"
												onClick={() => {
													deleteHandler(prod._id);
												}}
												style={{ height: '80%' }}
											>
												Delete
											</Button>
										</Grid>
									</Grid>
								</Grid>
								<Grid item style={{ marginLeft: 'auto' }}>
									<Typography variant="h6">
										<strong>${productPrice}</strong>
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
			<Grid item container justify="center" style={{ marginTop: '1%' }}>
				<Button
					variant="contained"
					color="primary"
					onClick={orderHandler}
				>
					Place Order
				</Button>
			</Grid>
		</Grid>
	);
};

export default Cart;
