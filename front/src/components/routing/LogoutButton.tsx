import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  localStorageDeleter,
  localStorageGetter,
} from '../../utils.ts/localStorage';

import * as AuthActions from '../../actions/AuthActions';
import { InfoNotification } from '../Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

interface Props {
  handleClose: () => void;
}

const LogoutButton = (props: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    const storedToken: string | null = localStorageGetter('token');
    if (storedToken) {
      localStorageDeleter('token');
      localStorageDeleter('userId');
    }
    dispatch(AuthActions.userLogout());
    props.handleClose();
    InfoNotification('Du har blivit utloggad');
    return <Redirect to={'/'} push={true} />;
  };
  return (
    <ExitToAppIcon onClick={handleClick}>
      Logga ut
    </ExitToAppIcon>
  );
};

export default LogoutButton;
