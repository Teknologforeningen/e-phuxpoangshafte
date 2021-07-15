import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/AuthReducer';

const LoginForm = (props: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submit = async (event: any) => {
    event.preventDefault();
    try {
      dispatch(loginUser(username, password));
      setUsername('');
      setPassword('');
    } catch (e) {
      console.log('Error loging in:', e);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
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
