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

const SignUp = () => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const history = useHistory();

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/auth/signup',
				{
					email: email,
					password: password,
					confirmPassword: confirmPassword
				},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			)
			.then((res) => {
				console.log(res);
				history.push('/login');
			})
			.catch((err) => {
				console.log(err);
				console.log('Failed to sign up');
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
					<TextField
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
	);
};

export default SignUp;
