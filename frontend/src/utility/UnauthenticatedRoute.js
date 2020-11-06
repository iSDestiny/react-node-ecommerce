import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const UnauthenticatedRoute = (props) => {
	const { isAuthenticated, children, path } = props;
	if (isAuthenticated) {
		return <Redirect to="/" />;
	} else {
		return <Route path={path}>{children}</Route>;
	}
};

export default UnauthenticatedRoute;
