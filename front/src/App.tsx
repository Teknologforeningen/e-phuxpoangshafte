import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import LoginForm from './components/LoginForm';

const App = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const notify = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 10000);
  };

  return (
    <div>
      <header>
        <div>
          <LoginForm setToken={setToken} setError={notify} />
        </div>
      </header>
    </div>
  );
};

export default App;
