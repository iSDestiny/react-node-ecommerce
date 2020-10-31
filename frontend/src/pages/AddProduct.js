import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Grid, TextField, Button, InputAdornment } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';
import ValidationErrorMessage from '../UI/ValidationErrorMessage';

const AddProduct = (props) => {
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [image, setImage] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [failed, setFailed] = useState(false);
	const history = useHistory();

	const { edit } = props;

	useEffect(() => {
		if (id) {
			axios.get(`${backendDomain}/shop/products/${id}`).then((res) => {
				console.log(res.data);
				setTitle(res.data.title);
				setImage(res.data.imageUrl);
				setPrice(res.data.price);
				setDescription(res.data.description);
			});
		} else {
			setTitle('');
			setImage('');
			setPrice('');
			setDescription('');
		}
	}, [edit]);

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/admin/add-product',
				{
					title: title,
					image: image,
					price: price,
					description: description,
					_csrf: props.csrfToken
				},
				{ withCredentials: true }
			)
			.then((res) => {
				console.log(res);
				history.push('/products');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const editHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/admin/edit-product',
				{
					id: id,
					title: title,
					image: image,
					price: price,
					description: description,
					_csrf: props.csrfToken
				},
				{ withCredentials: true }
			)
			.then((res) => {
				if (res.data.success) {
					console.log(res);
					history.push('/admin-products');
					setFailed(false);
				} else {
					setFailed(true);
					console.log(
						'User does not have permission to edit this product'
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			{failed && (
				<ValidationErrorMessage>
					You do not have permission to edit this product!
				</ValidationErrorMessage>
			)}
			<form onSubmit={edit ? editHandler : submitHandler}>
				<Grid
					container
					justify="center"
					alignItems="center"
					spacing={3}
				>
					<Grid item xs={12}>
						<TextField
							label="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Image URL"
							value={image}
							onChange={(e) => setImage(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Price"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							type="number"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Description"
							value={description}
							multiline
							rows={6}
							onChange={(e) => setDescription(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<Button
							variant="contained"
							type="submit"
							color="primary"
							fullWidth
						>
							{edit ? 'Update Product' : 'Add Product'}
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
};

export default AddProduct;
