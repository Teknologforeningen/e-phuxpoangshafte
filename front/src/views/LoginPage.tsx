import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../actions';
import authService from '../services/auth';
import { localStorageSetter } from '../utils.ts/localStorage';

const LoginForm = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submit = async (event: any) => {
    event.preventDefault();
    try {
      const loggedInUser = await authService.login({ email, password });
      localStorageSetter('auth', JSON.stringify(loggedInUser));
      dispatch(userLogin(loggedInUser));
      setEmail('');
      setPassword('');
    } catch (e) {
      console.log('Error loging in:', e);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          email{' '}
          <input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
