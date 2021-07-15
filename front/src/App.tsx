import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HelloPage from './components/HelloPage';
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
