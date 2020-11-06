import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';
import buildUrl from '../utility/buildUrl';

const Product = (props) => {
	const { id } = useParams();
	const history = useHistory();
	const [product, setProduct] = useState();

	const { token } = props;
	useEffect(() => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_DOMAIN + `/shop/products/${id}`,
				{
					withCredentials: true
				}
			)
			.then((res) => {
				console.log(res.data);
				setProduct(res.data);
			});
	}, [id]);
	const addToCartHandler = () => {
		axios
			.post(
				process.env.REACT_APP_BACKEND_DOMAIN + '/shop/add-to-cart',
				{
					id: id,
					price: product.price
				},
				{ headers: { Authorization: 'Bearer ' + token } }
			)
			.then((res) => {
				console.log(res);
				history.push('/cart');
			});
	};
	return (
		<Grid container direction="column" alignItems="center" spacing={2}>
			{product && (
				<>
					<Grid item>
						<Typography variant="h3">{product.title}</Typography>
					</Grid>
					<hr style={{ width: '100%' }} />
					<Grid item>
						<img
							style={{ height: '20rem', width: 'auto' }}
							src={buildUrl(
								process.env.REACT_APP_BACKEND_DOMAIN,
								product.imageUrl
							)}
							alt="product"
						/>
					</Grid>
					<Grid item>
						<Typography variant="h5">${product.price}</Typography>
					</Grid>
					<Grid item>
						<Typography variant="body1">
							{product.description}
						</Typography>
					</Grid>
					<Grid item>
						{props.isAuthenticated && (
							<Button
								color="primary"
								variant="outlined"
								onClick={addToCartHandler}
								style={{ marginTop: '1rem' }}
							>
								Add to Cart
							</Button>
						)}
					</Grid>
				</>
			)}
		</Grid>
	);
};

export default Product;
