import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';
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

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/auth/login',
				{
					email: email,
					password: password,
					_csrf: props.csrfToken
				},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			)
			.then((res) => {
				setEmailError(false);
				setPasswordError(false);
				if (res.data.success) {
					console.log('login success');
					history.push('/');
				} else {
					console.log('login failure, info did not match');
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
					} else {
						setErrorMessage(res.data.message);
						setFailed(true);
					}
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
