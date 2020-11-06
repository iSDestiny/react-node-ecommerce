import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import ValidationErrorMessage from '../UI/ValidationErrorMessage';

const useStyles = makeStyles({
	rootInput: {
		width: '50%'
	}
});

const Login = (props) => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [failed, setFailed] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const history = useHistory();

	const {
		setUserId,
		setToken,
		setIsAuthenticated,
		isAuthenticated,
		autoLogout
	} = props;

	const submitHandler = (event) => {
		event.preventDefault();
		if (isAuthenticated) return history.replace('/');
		axios
			.post(
				process.env.REACT_APP_BACKEND_DOMAIN + '/auth/login',
				{
					email: email,
					password: password
				},
				{
					headers: { 'Content-Type': 'application/json' }
					// withCredentials: true
				}
			)
			.then((res) => {
				console.log('login success');
				setUserId(res.data.userId);
				setToken(res.data.token);
				setIsAuthenticated(true);
				localStorage.setItem('token', res.data.token);
				localStorage.setItem('userId', res.data.userId);
				const remainingTime = 60 * 60 * 1000;
				const expiryDate = new Date(
					new Date().getTime() + remainingTime
				);
				localStorage.setItem('expiryDate', expiryDate.toISOString());
				autoLogout(remainingTime);
				history.push('/');
			})
			.catch((err) => {
				console.log(err.response);
				setEmailError(false);
				setPasswordError(false);
				const allErrors = err.response.data.allErrors;
				console.log('failed to login');
				if (allErrors) {
					const params = new Set(allErrors.map((err) => err.param));
					if (params.has('password')) {
						setPasswordError(true);
					}
					if (params.has('email')) {
						setEmailError(true);
					}
				} else if (err.response.status === 401) {
					setErrorMessage(err.response.data.message);
					setFailed(true);
				} else {
					history.push('/500');
				}
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
								emailError
									? 'Email must be valid (i.e. example@test.com)'
									: null
							}
							variant="outlined"
							label="Email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item className={classes.rootInput}>
						<TextField
							error={passwordError}
							helperText={
								passwordError
									? 'Password must be at least 5 characters long'
									: null
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
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
						>
							Login
						</Button>
					</Grid>
					<Grid item>
						<Link to="/reset">Reset Password</Link>
					</Grid>
				</Grid>
			</form>
		</>
	);
};

export default Login;
