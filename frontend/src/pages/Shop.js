import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Paper, Grid, Typography, Button } from '@material-ui/core';
import buildUrl from '../utility/buildUrl';
// import { makeStyles } from '@material-ui/core/styles';

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
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasMore, setHasMore] = useState(false);
	// const classes = useStyles();
	const { token, pageType, isAuthenticated } = props;

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
			pageType === 2 ? '/shop/admin-products' : '/shop/products';
		const productsUrl = new URL(
			process.env.REACT_APP_BACKEND_DOMAIN + route
		);
		productsUrl.searchParams.append('page', page);
		productsUrl.searchParams.append('items', ITEMS_PER_PAGE);
		console.log('hello');
		axios
			.get(productsUrl.href, {
				withCredentials: true,
				headers: { Authorization: 'Bearer ' + token },
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
	}, [page, token, pageType]);

	const addToCartHandler = (id) => {
		axios
			.post(
				process.env.REACT_APP_BACKEND_DOMAIN + '/shop/add-to-cart',
				{ id: id },
				{ headers: { Authorization: 'Bearer ' + token } }
			)
			.then((res) => {
				console.log(res);
			});
	};

	const deleteHandler = (id) => {
		axios
			.delete(
				process.env.REACT_APP_BACKEND_DOMAIN + '/admin/product/' + id,
				{
					headers: { Authorization: 'Bearer ' + token }
				}
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
					let buttons = 'xd';
					console.log(pageType);
					switch (pageType) {
						case 0:
							buttons = isAuthenticated && (
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
											deleteHandler(item._id);
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
						default:
							buttons = null;
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
											process.env
												.REACT_APP_BACKEND_DOMAIN,
											item.imageUrl
										)}
										alt="product"
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
