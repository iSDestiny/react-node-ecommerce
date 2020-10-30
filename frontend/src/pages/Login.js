import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';

const useStyles = makeStyles({
	rootInput: {
		width: '50%'
	}
});

const Login = () => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/auth/login',
				{
					email: email,
					password: password
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
				}
			})
			.catch((err) => {
				console.log(err);
				console.log('failed to login');
			});
	};

	return (
		<form onSubmit={submitHandler}>
			<Grid container direction="column" alignItems="center" spacing={1}>
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
						onChange={(event) => setPassword(event.target.value)}
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
			</Grid>
		</form>
	);
};

export default Login;
