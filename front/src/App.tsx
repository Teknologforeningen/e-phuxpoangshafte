import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginForm from './views/LoginPage';
import HelloPage from './views/HelloPage';
import PrivateRoute from './components/routing/PrivateRoute';
import { localStorageGetter } from './utils.ts/localStorage';
import { authDetails } from './types';
import { userLogin } from './actions/AuthActions';

const App = () => {
  const [state, changeState] = useState(false) 
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser: authDetails | null = localStorageGetter('auth')
    if(storedUser){
      dispatch(userLogin(storedUser))
    }
    changeState(true)
  }, [dispatch]);

  return (
    <div>
      <h1>Phuxpoäng</h1>
      <BrowserRouter>
        <Switch>
          {state ?
          <React.Fragment>
          <Route path="/login">
            <LoginForm />
          </Route>
          <PrivateRoute component={HelloPage} path="/" exact /> </React.Fragment>
          : <Route><HelloPage email={''}/></Route> }
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
