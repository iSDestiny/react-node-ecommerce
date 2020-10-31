import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import backendDomain from '../utility/backendDomain';
import ValidationErrorMessage from '../UI/ValidationErrorMessage';

const useStyles = makeStyles({
	rootInput: {
		width: '50%'
	}
});

const UpdatePassword = (props) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [failed, setFailed] = useState(false);
	const history = useHistory();
	const { token } = useParams();

	useEffect(() => {
		axios
			.get(backendDomain + `/auth/reset/${token}`, {
				withCredentials: true
			})
			.then((res) => {
				const { userId, success } = res.data;
				if (success) {
					setUserId(userId);
				} else {
					history.push('/404');
				}
				setLoading(false);
			});
	}, []);

	const submitHandler = (event) => {
		event.preventDefault();
		axios
			.post(
				backendDomain + '/auth/new-password',
				{
					password: password,
					_csrf: props.csrfToken,
					token: token,
					id: userId
				},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			)
			.then((res) => {
				console.log(res);
				if (res.data.success) {
					console.log('password update successful!');
					history.push('/login');
				} else {
					console.log('password update failed, token expired');
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
					Password update failed, token expired
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
							label="Password"
							type="password"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							fullWidth
						/>
					</Grid>
					<Grid item className={classes.rootInput}>
						<TextField
							variant="outlined"
							type="password"
							label="Confirm Password"
							value={confirmPassword}
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
							Update Password
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
};

export default UpdatePassword;
