import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';

const PageNotFound = () => {
	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			direction="column"
			spacing={3}
		>
			<Grid item>
				<Typography variant="h3">
					<strong>404: Page not Found</strong>
				</Typography>
			</Grid>

			<Grid item>
				<Button
					variant="outlined"
					color="primary"
					component={Link}
					to="/"
					size="large"
				>
					Return To Homepage
				</Button>
			</Grid>
		</Grid>
	);
};

export default PageNotFound;
