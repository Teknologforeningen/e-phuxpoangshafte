import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import * as AuthSelectors from '../../selectors/AuthSelectors';

const PrivateRoute: React.FC<RouteProps> = ({
  component: Component,
  render,
  ...rest
}) => {
  const auth = useSelector(AuthSelectors.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.userIsAutharized ? (
          Component
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

/**
 * 
 * Exempel authRoute
 * 
 * const AuthRoute: React.FC<RouteProps> = ({ component: Component, render, ...rest }) => {
	if (!auth.currentUser) {
		const loginRedirect = {
			to: {
				pathname: Routes.LOGIN,
			},
		};
		const redirect = () => <Redirect {...loginRedirect} />;
		return <Route {...rest} render={redirect} />;
	}

	if (Component) {
		return <Route {...rest} render={(props) => <Component {...props} />} />;
	} else {
		return <Route {...rest} render={render} />;
	}
};

export default AuthRoute;
*/
