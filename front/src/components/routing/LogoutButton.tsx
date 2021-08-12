import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { localStorageGetter } from '../../utils.ts/localStorage';

import * as AuthActions from '../../actions/AuthActions';

interface Props {
  handleClose: () => void;
}

const LogoutButton = (props: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    const storedToken: string | null = localStorageGetter('token');
    if (storedToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    dispatch(AuthActions.userLogout());
    props.handleClose();
    return <Redirect to={'/'} push={true} />;
  };
  return (
    <Button onClick={handleClick} variant={'contained'}>
      Logga ut
    </Button>
  );
};

export default LogoutButton;
