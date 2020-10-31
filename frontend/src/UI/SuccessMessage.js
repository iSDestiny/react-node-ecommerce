import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		backgroundColor: '#81fca2',
		width: '60%',
		color: '#0a6e25',
		padding: '0.5rem 0rem',
		justifyContent: 'center',
		marginBottom: '2rem'
	}
});

const SuccessMessage = (props) => {
	const classes = useStyles();
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Paper variant="outlined" className={classes.root}>
				<Typography variant="subtitle1">{props.children}</Typography>
			</Paper>
		</div>
	);
};

export default SuccessMessage;
