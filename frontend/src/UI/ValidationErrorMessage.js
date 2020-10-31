import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		backgroundColor: '#f4DDDD',
		// borderColor: '#b71c1c',
		// borderWidth: 'medium',
		width: '60%',
		color: '#b71c1c',
		padding: '0.5rem 0rem',
		justifyContent: 'center',
		marginBottom: '2rem'
	}
});

const ValidationErrorMessage = (props) => {
	const classes = useStyles();
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Paper variant="outlined" className={classes.root}>
				<Typography variant="subtitle1">{props.children}</Typography>
			</Paper>
		</div>
	);
};

export default ValidationErrorMessage;
