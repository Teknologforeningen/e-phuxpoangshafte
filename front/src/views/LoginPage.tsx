import React from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../actions';
import * as AuthServices from '../services/AuthServices';
import { localStorageSetter } from '../utils/localStorage';
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
    } catch (e: any) {
      // TODO: error handling om du ger fel credentials, meddela om de
      if (e.code === 401) {
        ErrorNotification('Fel mail eller lösenord');
      } else {
        ErrorNotification('Inloggning misslyckades');
      }
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
      <form onSubmit={formik.handleSubmit}>
        <Box className={classes.loginSpread}>
          <Typography textAlign="center" variant={'h4'}>
            Logga in{' '}
          </Typography>
          <Box>
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
                variant="filled"
                InputLabelProps={{
                  classes: {
                    focused: classes.labelFocused,
                  },
                }}
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
                variant="filled"
                InputLabelProps={{
                  classes: {
                    focused: classes.labelFocused,
                  },
                }}
              />
            </Box>
          </Box>
          <Box>
            <Box className={classes.centerAlignRow}>
              <Button
                variant={'contained'}
                className={classes.submitButton}
                type={'submit'}
                size={'large'}
              >
                Logga in
              </Button>
              <Typography className={classes.helpText} variant={'body2'}>
                Inte registerad ännu? Registera dig
                <Link
                  href={Routes.SIGNUP}
                  variant={'inherit'}
                  color={'secondary'}
                  underline={'hover'}
                  m={0.5}
                  noWrap
                >
                  här
                </Link>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </form>
    </>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      loginSpread: {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 72px)',
        justifyContent: 'space-evenly',
      },
      centerAlign: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      },
      centerAlignRow: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 10,
      },
      helpText: {
        textAlign: 'center',
        maxWidth: '290px',
        color: theme.palette.primary.contrastText,
        margin: '10px auto 0 auto',
      },
      fields: {
        width: '100%',
        maxWidth: '290px',
      },
      submitButton: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.main,
        width: '100%',
        maxWidth: '290px',
        padding: theme.spacing(2, 0),
        margin: '0 auto',
        borderRadius: 0,
      },
      labelFocused: {
        color: `${theme.palette.common.black} !important`,
      },
    }),
  { index: 1 },
);

export default LoginForm;
