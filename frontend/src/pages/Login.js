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
				console.log(res);
				if (res.data.success) {
					console.log('login success');
					history.push('/');
				} else {
					console.log('login failure, info did not match');
					setFailed(true);
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
					Invalid email or password
				</ValidationErrorMessage>
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
						<TextField
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
