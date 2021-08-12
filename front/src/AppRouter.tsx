import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import { Routes } from './types';
import AdminPage from './views/Admin';
import CategoryPage from './views/CategoryPage';
import LoginForm from './views/LoginPage';
import MemberDashboard from './views/MemberDashboard';
import SignupPage from './views/SignupPage';
import SuccessfulsignupPage from './views/SuccessfulsignupPage';
import * as AuthSelector from './selectors/AuthSelectors';
import { CircularProgress } from '@material-ui/core';


const AppRouter = () => {
  const auth = useSelector(AuthSelector.auth)

  return (
    <BrowserRouter>
      <Switch>
        <Route path={Routes.LOGIN}>
          <LoginForm />
        </Route>
        {auth.userIsAutharized ? (
          <React.Fragment>
            <Route path={Routes.SIGNUP}>
              <SignupPage />
            </Route>
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
        ) : auth.userIsAutharized === null ? <CircularProgress color={'secondary'}/> : (
          <Redirect to={Routes.LOGIN} push={true} />
        )}
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
