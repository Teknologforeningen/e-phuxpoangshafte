import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import { Routes } from './types';
import AdminPage from './views/Admin';
import CategoryPage from './views/Categories/Index';
import LoginForm from './views/LoginPage';
import MemberDashboard from './views/MemberDashboard';
import SignupPage from './views/SignupPage';
import SuccessfulsignupPage from './views/SuccessfulsignupPage';
import * as AuthSelector from './selectors/AuthSelectors';
import { CircularProgress } from '@material-ui/core';
import UserSettings from './views/UserSettings';

const AppRouter = () => {
  const auth = useSelector(AuthSelector.auth);

  return (
    <BrowserRouter>
      <Switch>
        <Route path={Routes.LOGIN}>
          <LoginForm />
        </Route>
        <Route path={Routes.SIGNUP}>
          <SignupPage />
        </Route>
        {auth.userIsAutharized ? (
          <React.Fragment>
            <PrivateRoute
              component={UserSettings}
              path={Routes.USER_SETTINGS}
              exact
            />
            <PrivateRoute
              component={CategoryPage}
              path={Routes.SPECIFIC_CATEGORY}
              exact
            />
            <Route path={'/admin'}>
              <AdminPage />
            </Route>
            <Route path={'/successfulsignup'}>
              <SuccessfulsignupPage />
            </Route>
            <PrivateRoute
              component={MemberDashboard}
              path={Routes.ROOT}
              exact
            />
          </React.Fragment>
        ) : auth.userIsAutharized === null ? (
          <CircularProgress color={'secondary'} />
        ) : (
          <Redirect to={Routes.LOGIN} push={true} />
        )}
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
