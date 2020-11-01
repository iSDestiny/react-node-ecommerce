import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';
import ValidationErrorMessage from '../UI/ValidationErrorMessage';

const useStyles = makeStyles({
	rootInput: {
		width: '50%'
	}
});

const SignUp = (props) => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [failed, setFailed] = useState(false);
	const history = useHistory();

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/auth/signup',
				{
					email: email,
					password: password,
					confirmPassword: confirmPassword,
					_csrf: props.csrfToken
				},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			)
			.then((res) => {
				if (res.data.success) {
					console.log('registration success!');
					history.push('/login');
				} else {
					console.log('registration failed, email already exists!');
					setPasswordError(false);
					setEmailError(false);
					setConfirmPasswordError(false);
					if (res.data.allErrors) {
						const params = new Set(
							res.data.allErrors.map((err) => err.param)
						);
						if (params.has('password')) {
							setPasswordError(true);
						}
						if (params.has('email')) {
							setEmailError(true);
						}
						if (params.has('confirmPassword')) {
							setConfirmPasswordError(true);
						}
					} else {
						setErrorMessage(res.data.message);
						setFailed(true);
					}
				}
			})
			.catch((err) => {
				console.log(err);
				console.log('Failed to sign up');
			});
	};

	return (
		<>
			{failed && (
				<ValidationErrorMessage>{errorMessage}</ValidationErrorMessage>
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
							error={emailError}
							helperText={
								emailError &&
								'Email must be valid (i.e. example@test.com)'
							}
							variant="outlined"
							label="Email"
							// type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item className={classes.rootInput}>
						<TextField
							error={passwordError}
							helperText={
								passwordError &&
								'Password must be at least 5 characters long'
							}
							variant="outlined"
							label="Password"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							type="password"
							fullWidth
						/>
					</Grid>
					<Grid item className={classes.rootInput}>
						<TextField
							error={confirmPasswordError}
							helperText={
								confirmPasswordError && 'Passwords must match'
							}
							variant="outlined"
							label="Confirm Password"
							value={confirmPassword}
							type="password"
							onChange={(event) =>
								setConfirmPassword(event.target.value)
							}
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
							Sign Up
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
};

export default SignUp;
