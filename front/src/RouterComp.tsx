import { CircularProgress } from '@material-ui/core';
import { RequestPage } from '@material-ui/icons';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import { Routes } from './types';
import AdminPage from './views/Admin';
import CategoryPage from './views/CategoryPage';
import LoginForm from './views/LoginPage';
import MemberDashboard from './views/MemberDashboard';
import NewCatAndEventPage from './views/Admin/NewCategoryAndEventPage';
import SignupPage from './views/SignupPage';
import SuccessfulsignupPage from './views/SuccessfulsignupPage';

const RouterComp = ({ state }: { state: Boolean }) => {
  return (
    <BrowserRouter>
      <Switch>
        {state ? (
          <React.Fragment>
            <Route path={Routes.LOGIN}>
              <LoginForm />
            </Route>
            <Route path={Routes.SIGNUP}>
              <SignupPage />
            </Route>
            <Route path={'/kategori/obligatorisk'}>
              <CategoryPage categoryID={'1'} />
            </Route>
            <Route path={'/kategori/fest'}>
              <CategoryPage categoryID={'2'} />
            </Route>
            <Route path={'/admin/addmore'}>
              <NewCatAndEventPage />
            </Route>
            <Route path={'/admin/requests'}>
              <RequestPage />
            </Route>
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
        ) : (
          <Route>
            <CircularProgress color={'secondary'} />
          </Route>
        )}
      </Switch>
    </BrowserRouter>
  );
};

export default RouterComp;
