import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const UnauthenticatedRoute = (props) => {
	const { isAuthenticated, children, currPath, path, fetchDone } = props;
	if (isAuthenticated) {
		return <Redirect to="/" />;
	} else if (!fetchDone) {
		return <div></div>;
	} else {
		return <Route path={path}>{children}</Route>;
	}
};

export default UnauthenticatedRoute;
