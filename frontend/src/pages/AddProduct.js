import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Grid, TextField, Button, InputAdornment } from '@material-ui/core';
import backendDomain from '../utility/backendDomain';
import ValidationErrorMessage from '../UI/ValidationErrorMessage';

const AddProduct = (props) => {
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [image, setImage] = useState();
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [failed, setFailed] = useState(false);
	const [validationMessages, setValidationMessages] = useState({});
	const history = useHistory();

	const { edit } = props;

	useEffect(() => {
		if (id) {
			axios.get(`${backendDomain}/shop/products/${id}`).then((res) => {
				console.log(res.data);
				setTitle(res.data.title);
				setPrice(res.data.price);
				setDescription(res.data.description);
			});
		} else {
			setTitle('');
			setPrice('');
			setDescription('');
		}
	}, [edit]);

	const submitHandler = (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('image', image);
		formData.append('title', title);
		formData.append('price', price);
		formData.append('description', description);
		formData.append('_csrf', props.csrfToken);
		// console.log(formData);
		axios
			.post(backendDomain + '/admin/add-product', formData, {
				withCredentials: true,
				headers: { 'Content-Type': 'multipart/form-data' }
			})
			.then((res) => {
				console.log(res.data);
				const allErrors = res.data.allErrors;
				if (allErrors) {
					setValidationMessages({});
					allErrors.forEach((err) => {
						setValidationMessages((prev) => {
							return { ...prev, [err.param]: err.msg };
						});
					});
				} else {
					history.push('/products');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const editHandler = (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('id', id);
		formData.append('image', image);
		formData.append('title', title);
		formData.append('price', price);
		formData.append('description', description);
		formData.append('_csrf', props.csrfToken);
		axios
			.post(backendDomain + '/admin/edit-product', formData, {
				withCredentials: true,
				headers: { 'Content-Type': 'multipart/form-data' }
			})
			.then((res) => {
				if (res.data.success) {
					console.log(res);
					history.push('/admin-products');
					setFailed(false);
				} else {
					const allErrors = res.data.allErrors;
					if (allErrors) {
						setValidationMessages({});
						allErrors.forEach((err) => {
							setValidationMessages((prev) => {
								return { ...prev, [err.param]: err.msg };
							});
						});
					} else {
						setFailed(true);
						console.log(
							'User does not have permission to edit this product'
						);
					}
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
							error={validationMessages.title !== undefined}
							helperText={validationMessages.title}
							label="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={validationMessages.image !== undefined}
							helperText={validationMessages.image}
							label="Image"
							type="file"
							onChange={(e) => setImage(e.target.files[0])}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={validationMessages.price !== undefined}
							helperText={validationMessages.price}
							label="Price"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							type="number"
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={validationMessages.description !== undefined}
							helperText={validationMessages.description}
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
