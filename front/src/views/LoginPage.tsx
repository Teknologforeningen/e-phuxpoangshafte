import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../actions';
import authService from '../services/AuthServices';
import { localStorageSetter } from '../utils.ts/localStorage';
import { Box, TextField, Button} from '@material-ui/core';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles'

const LoginForm = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles()

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
    <Box>
      <Box display={'flex'} flexDirection={'column'} className={classes.container}>
          <TextField 
            variant={'outlined'}
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label={'Email'}
          />
          <Box margin={0.5}/>
          <TextField 
          variant={'outlined'}
            value={password}
            type={'password'}
            onChange={({ target }) => setPassword(target.value)}
            label={'Password'}
            InputLabelProps={{classes: {
              root: classes.redLabel
            }}}
          />
      </Box>
          <Box>
        <Button variant={'contained'} className = {classes.redLabel} onClick={submit}>login</Button>
        </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    maxWidth: 300,
  },
  redLabel: {
    color: theme.palette.secondary.main
  }
}))

export default LoginForm;
