import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/routing/PrivateRoute';

const App = () => {
  /*const [errorMessage, setErrorMessage] = useState<string>('');

  const notify = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 10000);
  };
  */
  const auth = useSelector(state => state.auth)

  if(!auth){
    return(
      <Redirect to={{pathname: "/login"}}
    />
    )
  }

  return (
    <div>
      <h1>Phuxpoäng</h1>
      <Switch>
        <Route path="/login">
          <LoginForm />
        </Route>
        <PrivateRoute path="/">
          Hello {auth.email}
        </PrivateRoute>
      </Switch>
    </div>
  );
};



export default App;
