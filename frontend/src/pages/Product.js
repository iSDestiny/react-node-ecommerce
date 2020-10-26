import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';

const Product = (props) => {
	const { id } = useParams();
	const history = useHistory();
	const [product, setProduct] = useState();
	useEffect(() => {
		axios.get(backendDomain + `/shop/products/${id}`).then((res) => {
			console.log(res.data);
			setProduct(res.data);
		});
	}, []);
	const addToCartHandler = () => {
		axios
			.post(backendDomain + '/shop/add-to-cart', {
				id: id,
				price: product.price,
			})
			.then((res) => {
				console.log(res);
			});
		history.push('/cart');
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
						<img src={product.imageUrl} alt="product image" />
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
						<Button
							color="primary"
							variant="outlined"
							onClick={addToCartHandler}
							style={{ marginTop: '1rem' }}
						>
							Add to Cart
						</Button>
					</Grid>
				</>
			)}
		</Grid>
	);
};

export default Product;
