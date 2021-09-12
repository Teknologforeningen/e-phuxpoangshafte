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
import * as AuthSelector from './selectors/AuthSelectors';
import { Box, CircularProgress, Theme } from '@material-ui/core';
import UserSettings from './views/UserSettings';
import { makeStyles, createStyles } from '@material-ui/styles';
import StartPage from './views/StartPage';
import NavBar, { navBarHeight } from './components/Navigation/NavBar';
import QRPage from './components/Hashing/QRPage';
import QRvalidation from './components/Hashing/QRvalidation';

const AppRouter = () => {
  const classes = useStyles();
  const auth = useSelector(AuthSelector.auth);

  return (
    <Box>
      <BrowserRouter>
        <Switch>
          <Route path={Routes.LOGIN}>
            <LoginForm />
          </Route>
          <Route path={Routes.SIGNUP}>
            <SignupPage />
          </Route>
          <Route path={Routes.START}>
            <StartPage />
          </Route>
          <Route path={Routes.EVENT_VALIDATION}>
            <QRvalidation />
          </Route>
          <Route path={Routes.EVENT_GENERATION}>
            <QRPage />
          </Route>

          {auth.userIsAutharized ? (
            <Box className={classes.content}>
              <NavBar />
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
              <PrivateRoute
                component={MemberDashboard}
                path={Routes.ROOT}
                exact
              />
            </Box>
          ) : auth.userIsAutharized === null ? (
            <Box className={classes.centerBox}>
              <CircularProgress color={'secondary'} />
            </Box>
          ) : (
            <Redirect to={Routes.START} push={true} />
          )}
        </Switch>
      </BrowserRouter>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginTop: navBarHeight + 5,
      padding: theme.spacing(0, 2),
    },
    centerBox: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

export default AppRouter;
