import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = (props) => {
	const { isAuthenticated, path, children } = props;
	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	} else {
		return <Route path={path}> {children} </Route>;
	}
};

export default AuthenticatedRoute;
