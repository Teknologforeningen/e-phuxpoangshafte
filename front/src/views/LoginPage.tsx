import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../actions';
import * as AuthServices from '../services/AuthServices';
import { localStorageSetter } from '../utils.ts/localStorage';
import {
  Box,
  TextField,
  Button,
  Theme,
  Typography,
  Link,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  ErrorNotification,
  SuccessNotification,
} from '../components/Notifications';
import { Routes } from '../types';
import TFLogoSVG from '../styles/img/TFlogo';
import NonAuthNavBar from '../components/Navigation/NonAuthNavBar';

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
      SuccessNotification('Din inloggning lyckades!');
      history.push('/');
    } catch (e) {
      // TODO: error handling om du ger fel credentials, meddela om de
      console.log('Error loging in:', e);
      ErrorNotification('Inloggning misslyckades');
    }
  };

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <NonAuthNavBar />
      <Box className={classes.loginSpread}>
        <Typography className={classes.title}>Logga in </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box className={classes.textFieldBoxes}>
            <Box className={classes.centerAlign}>
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
                className={classes.fields}
              />
            </Box>
            <Box margin={0.5} className={classes.centerAlign}>
              <TextField
                id={'password'}
                type={'password'}
                name={'password'}
                label={'Lösenord'}
                aria-label={'Lösenord'}
                placeholder={'Lösenord'}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                className={classes.fields}
              />
            </Box>
            <Box className={classes.centerAlignRow}>
              <Button
                variant={'contained'}
                className={classes.submitButton}
                type={'submit'}
                size={'large'}
              >
                Logga in
              </Button>
            </Box>
            <Box className={classes.helpTextBox}>
              <Typography className={classes.helpText}>
                Inte registerad ännu? Börja med att
                <Link
                  href={Routes.SIGNUP}
                  variant={'inherit'}
                  color={'secondary'}
                  underline={'hover'}
                  m={0.5}
                  noWrap
                >
                  trycka här
                </Link>
                för att skapa en användare
              </Typography>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginSpread: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      justifyContent: 'center',
    },
    centerAlign: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    centerAlignRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    title: {
      textAlign: 'center',
      fontSize: '200%',
      margin: '60px 0 40px 0',
    },
    helpTextBox: {
      margin: 10,
    },
    helpText: {
      textAlign: 'center',
      fontSize: '110%',
      color: theme.palette.primary.contrastText,
    },
    fields: {
      maxWidth: '80vw',
    },
    submitButton: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
      minWidth: '200px',
    },
    textFieldBoxes: {
      margin: '16px 0',
    },
  }),
);

export default LoginForm;
