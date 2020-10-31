import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = (props) => {
	const { isAuthenticated, fetchDone, path, children } = props;
	if (!fetchDone) {
		return <div></div>;
	} else if (!isAuthenticated) {
		return <Redirect to="/login" />;
	} else {
		return <Route path={path}> {children} </Route>;
	}
};

export default AuthenticatedRoute;
