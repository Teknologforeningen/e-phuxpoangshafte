import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { auth } from '../../selectors/AuthSelectors';
import { Routes } from '../../types';

const PrivateRoute: React.FC<RouteProps> = ({
  component: Component,
  render,
  ...rest
}) => {
  const authentication = useSelector(auth);
  if (!authentication.userIsAutharized) {
    const loginRedirect = {
      to: {
        pathname: Routes.LOGIN,
      },
    };
    const redirect = () => <Redirect {...loginRedirect} />;
    return <Route {...rest} render={redirect} />;
  }

  if (Component) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    return <Route {...rest} render={render} />;
  }
};

export default PrivateRoute;
