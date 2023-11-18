import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  localStorageDeleter,
  localStorageGetter,
} from '../../utils/localStorage';
import { Typography, Box, Theme } from '@mui/material';
import * as AuthActions from '../../actions/AuthActions';
import { InfoNotification } from '../Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { createStyles, makeStyles } from '@mui/styles';

interface Props {
  handleClose: () => void;
}

const LogoutButton = (props: Props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

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
    <Box onClick={handleClick} display={'flex'}>
      <ExitToAppIcon className={classes.icon} />
      <Typography>Logga ut</Typography>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
  }),
);

export default LogoutButton;
