import React from 'react';
import { useSelector } from 'react-redux';
import * as AuthSelectors from '../selectors/AuthSelectors';
import { AuthState } from '../types';

interface Props {
  email: string;
}



const HelloPage = (props: Props) => {
  const auth: AuthState = useSelector(AuthSelectors.auth);
  //const { email } = props;
  return (
    <div>
      <p>Hello {auth.userInfo?.userMail}</p>
    </div>
  );
};

export default HelloPage;
