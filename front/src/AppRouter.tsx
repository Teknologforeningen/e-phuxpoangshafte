import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import { Routes } from './types';
import AdminPage from './views/Admin';
import CategoryPage from './views/Categories/Index';
import LoginForm from './views/LoginPage';
import MemberDashboard from './views/MemberDashboard';
import SignupPage from './views/SignupPage';
import { auth } from './selectors/AuthSelectors';
import { Box, CircularProgress, Theme } from '@mui/material';
import UserSettings from './views/UserSettings';
import { makeStyles, createStyles } from '@mui/styles';
import StartPage from './views/StartPage';
import NavBar, { navBarHeight } from './components/Navigation/NavBar';
import QRPage from './components/Hashing/QRPage';
import QRvalidation from './components/Hashing/QRvalidation';
import InstructionsList from './views/Instructions';
import AdminRoute from './components/routing/AdminRoute';
import ResetPasswordForm from './views/ResetPasswordPage';

const AppRouter = () => {
  const classes = useStyles();
  const authentication = useSelector(auth);

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
          <Route path={Routes.RESET_PASSWORD}>
            <ResetPasswordForm />
          </Route>

          {authentication.userIsAutharized ? (
            <Box className={classes.flex}>
              <NavBar />
              <Box className={classes.content}>
                <PrivateRoute
                  component={InstructionsList}
                  path={Routes.INSTRUCTIONS}
                  exact
                />
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
                <AdminRoute
                  component={QRPage}
                  path={Routes.SPECIFIC_EVENT_GENERATION}
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
            </Box>
          ) : authentication.userIsAutharized === null ? (
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
    flex: {
      display: 'flex',
    },
    content: {
      marginTop: navBarHeight + 5,
      padding: theme.spacing(0, 2),
      flex: '1 1 0',
      [theme.breakpoints.down('md')]: {
        marginTop: navBarHeight + 5,
      },
    },
    centerBox: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

export default AppRouter;
