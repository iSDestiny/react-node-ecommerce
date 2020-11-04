import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';
import buildUrl from '../utility/buildUrl';
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
const ITEMS_PER_PAGE = 4;

const Shop = (props) => {
	const history = useHistory();
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasMore, setHasMore] = useState(false);
	// const classes = useStyles();

	const observer = useRef();
	const lastProductElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		const route =
			props.pageType === 2 ? '/shop/admin-products' : '/shop/products';
		const productsUrl = new URL(backendDomain + route);
		productsUrl.searchParams.append('page', page);
		productsUrl.searchParams.append('items', ITEMS_PER_PAGE);
		console.log('hello');
		axios
			.get(productsUrl.href, {
				withCredentials: true,
				cancelToken: new axios.CancelToken((c) => {
					cancel = c;
				})
			})
			.then((res) => {
				// console.log(res.data);
				setProducts((prev) => {
					return [...prev, ...res.data];
				});
				setLoading(false);
				setHasMore(res.data.length > 0);
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				setError(true);
			});
		return () => cancel();
	}, [page]);

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
				setProducts((prev) => {
					return prev.filter((prod) => prod._id !== id);
				});
			});
	};
	return (
		<Grid container spacing={4} justify="center">
			{products.length > 0 ? (
				products.map((item, index) => {
					// console.log('inside map!!');
					// console.log(props.products);
					// console.log(item);
					// console.log(item._id);
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
					return (
						<Grid
							item
							xs={12}
							md={6}
							key={item._id}
							ref={
								products.length - 1 === index
									? lastProductElementRef
									: undefined
							}
						>
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
										src={buildUrl(
											backendDomain,
											item.imageUrl
										)}
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
