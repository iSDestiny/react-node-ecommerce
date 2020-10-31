import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';
import ValidationErrorMessage from '../UI/ValidationErrorMessage';
import SuccessMessage from '../UI/SuccessMessage';

const useStyles = makeStyles({
	rootInput: {
		width: '50%'
	}
});

const Reset = (props) => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [failed, setFailed] = useState(false);
	const [success, setSuccess] = useState(false);
	// const history = useHistory();

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/auth/reset',
				{
					email: email,
					_csrf: props.csrfToken
				},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			)
			.then((res) => {
				console.log(res);
				if (res.data.success) {
					console.log('sent reset email');
					setSuccess(true);
					setFailed(false);
				} else {
					console.log('reset failed, email did not match');
					setFailed(true);
					setSuccess(false);
				}
			})
			.catch((err) => {
				console.log(err);
				console.log('failed to login');
			});
	};

	return (
		<>
			{failed && (
				<ValidationErrorMessage>
					Email does not exist
				</ValidationErrorMessage>
			)}
			{success && (
				<SuccessMessage>
					Password reset email sent! Please check your email
				</SuccessMessage>
			)}
			<form onSubmit={submitHandler}>
				<Grid
					container
					direction="column"
					alignItems="center"
					spacing={1}
				>
					<Grid item className={classes.rootInput}>
						<TextField
							variant="outlined"
							label="Email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item className={classes.rootInput}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
						>
							Send Reset Request
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
};

export default Reset;
