import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../actions';
import * as AuthServices from '../services/AuthServices';
import { localStorageSetter } from '../utils.ts/localStorage';
import { Box, TextField, Button, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ErrorNotification, SuccessNotification } from '../components/Notifications';

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const initial: LoginCredentials = {
    email: '',
    password: '',
  };

  const validation = Yup.object({
    email: Yup.string().required('Obligatorisk'),
    password: Yup.string().required('Obligatorisk'),
  });

  const handleSubmit = async (
    values: LoginCredentials,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      const loggedInUser = await AuthServices.login({
        email: values.email,
        password: values.password,
      });
      localStorageSetter('token', JSON.stringify(loggedInUser.token));
      localStorageSetter('userId', JSON.stringify(loggedInUser.id));
      dispatch(userLogin(loggedInUser));
      axios.defaults.headers.common[
        'authorization'
      ] = `Bearer ${loggedInUser.token}`;
      resetForm();
      SuccessNotification('Din inloggning lyckades!')
      history.push('/');
    } catch (e) {
      console.log('Error loging in:', e);
      ErrorNotification('Inloggning misslyckades')
    }
  };

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          className={classes.container}
        >
          <TextField
            id={'email'}
            name={'email'}
            label={'Email'}
            aria-label={'Email'}
            placeholder={'exempel@aalto.fi'}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Box margin={0.5} />
          <TextField
            id={'password'}
            type={'password'}
            name={'password'}
            label={'Lösenord'}
            aria-label={'Lösenord'}
            placeholder={'Lösenord'}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Box>
        <Box>
          <Button
            variant={'contained'}
            className={classes.redLabel}
            type={'submit'}
          >
            Logga in
          </Button>
        </Box>
      </Box>
    </form>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 300,
    },
    redLabel: {
      color: theme.palette.secondary.main,
    },
  }),
);

export default LoginForm;

/*return (
    <Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        className={classes.container}
      >
        <TextField
          variant={'outlined'}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={'Email'}
        />
        <Box margin={0.5} />
        <TextField
          variant={'outlined'}
          value={password}
          type={'password'}
          onChange={({ target }) => setPassword(target.value)}
          label={'Password'}
          InputLabelProps={{
            classes: {
              root: classes.redLabel,
            },
          }}
        />
      </Box>
      <Box>
        <Button
          variant={'contained'}
          className={classes.redLabel}
          onClick={submit}
        >
          login
        </Button>
      </Box>
    </Box>
  );*/
