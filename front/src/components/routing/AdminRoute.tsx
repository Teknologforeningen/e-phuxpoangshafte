import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import * as AuthSelectors from '../../selectors/AuthSelectors';
import { Routes, UserRole } from '../../types';

 const AdminRoute: React.FC<RouteProps> = ({ component: Component, render, ...rest }) => {
  const auth = useSelector(AuthSelectors.auth)
	if (!auth.userInfo || auth.userInfo.role === UserRole.BASIC) {
		const unautharizedRedirect = {
			to: {
				pathname: Routes.ROOT,
			},
		};
		const redirect = () => <Redirect {...unautharizedRedirect} />;
		return <Route {...rest} render={redirect} />;
	}

	if (Component) {
		return <Route {...rest} render={(props) => <Component {...props} />} />;
	} else {
		return <Route {...rest} render={render} />;
	}
};

export default AdminRoute;
