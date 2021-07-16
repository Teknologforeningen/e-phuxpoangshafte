import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LoginForm from './views/LoginForm';
import HelloPage from './views/HelloPage';
import PrivateRoute from './components/routing/PrivateRoute';
import * as AuthSelectors from './selectors/AuthSelectors';

const App = () => {
  /*const [errorMessage, setErrorMessage] = useState<string>('');

  const notify = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 10000);
  };
  */

  const dispatch = useDispatch();
  useEffect(() => {
    /*const loggedInUser = await authService.login({ username, password });
    localStorageSetter('auth', JSON.stringify(loggedInUser));
    dispatch(login(loggedInUser));*/
  }, []);

  const auth = useSelector(AuthSelectors.auth);

  if (!auth) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  return (
    <div>
      <h1>Phuxpoäng</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <LoginForm />
          </Route>
          <PrivateRoute component={HelloPage} path="/dashboard" exact />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
