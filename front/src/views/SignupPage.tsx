import React from 'react';
import {
  Box,
  Button,
  Link,
  MenuItem,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as UserService from '../services/UserServices';
import { FieldOfStudy, NewUser, Routes } from '../types';
import * as Yup from 'yup';
import NonAuthNavBar from '../components/Navigation/NonAuthNavBar';
import { makeStyles, createStyles } from '@material-ui/styles';
import { ErrorNotification, SuccessNotification } from '../components/Notifications';

export interface UserFormAttributes extends NewUser {
  confirmPassword: string;
}

const SignupPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const FieldOfStudyValues = Object.values(FieldOfStudy);
  const FieldOfStudyMenuItems = FieldOfStudyValues.map((item: FieldOfStudy) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ));

  const handleSubmit = async (values: NewUser) => {
    try {
      const response = await UserService.addUser(values);
      SuccessNotification('Registreringen lyckades');
      history.push('/login');
      return response;
    } catch (e) {
      console.error({ message: 'Could not add new user', error: e });
      ErrorNotification('Registreringen misslyckades')
    }
  };

  const initial: UserFormAttributes = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    fieldOfStudy: '',
    capWithTF: true,
    otherFieldOfStudy: undefined,
  };

  const validation = Yup.object({
    email: Yup.string()
      .email('Måste vara av formen exempel@domain.com')
      .required('Obligatoriskt'),
    password: Yup.string()
      .required('Obligatoriskt')
      .min(5, 'Lösen ordet måste vara mist 5 tecken långt')
      .oneOf(
        [Yup.ref('confirmPassword'), null],
        'Lösenorden är inte identiska!',
      ),
    confirmPassword: Yup.string()
      .required('Lösenorden är inte identiska!')
      .oneOf([Yup.ref('password'), null], "Passwords don't match!"),
    firstName: Yup.string().required('Obligatoriskt'),
    lastName: Yup.string().required('Obligatoriskt'),
    fieldOfStudy: Yup.string().required('Obligatoriskt'),
  });

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
            Skapa ditt konto
          </Typography>
          <Box display={'flex'} flexDirection={'column'}>
            <TextField
              variant={'filled'}
              id={'email'}
              name={'email'}
              label={'Email'}
              aria-label={'Email'}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              className={classes.fields}
              InputLabelProps={{
                classes: {
                  focused: classes.labelFocused,
                },
              }}
            />
            <TextField
              variant={'filled'}
              id={'password'}
              type={'password'}
              name={'password'}
              label={'Lösenord'}
              aria-label={'Lösenord'}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              className={classes.fields}
              InputLabelProps={{
                classes: {
                  focused: classes.labelFocused,
                },
              }}
            />
            <TextField
              variant={'filled'}
              id={'confirmPassword'}
              type={'password'}
              name={'confirmPassword'}
              label={'Bekräfta lösenord'}
              aria-label={'Bekräfta lösenord'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              className={classes.fields}
              InputLabelProps={{
                classes: {
                  focused: classes.labelFocused,
                },
              }}
            />
            <TextField
              variant={'filled'}
              id={'firstName'}
              name={'firstName'}
              label={'Förnamn'}
              aria-label={'Förnamn'}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              className={classes.fields}
              InputLabelProps={{
                classes: {
                  focused: classes.labelFocused,
                },
              }}
            />
            <TextField
              variant={'filled'}
              id={'lastName'}
              name={'lastName'}
              label={'Efternamn'}
              aria-label={'Efternamn'}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              className={classes.fields}
              InputLabelProps={{
                classes: {
                  focused: classes.labelFocused,
                },
              }}
            />
            <TextField
              select
              variant={'filled'}
              id={'fieldOfStudy'}
              name={'fieldOfStudy'}
              label={'Studieinriktning'}
              aria-label={'Studieinrikting'}
              placeholder={'Välj studieinriktning'}
              value={formik.values.fieldOfStudy}
              onChange={formik.handleChange('fieldOfStudy')}
              error={
                formik.touched.fieldOfStudy &&
                Boolean(formik.errors.fieldOfStudy)
              }
              helperText={
                formik.touched.fieldOfStudy && formik.errors.fieldOfStudy
              }
              className={classes.fields}
              InputLabelProps={{
                classes: {
                  focused: classes.labelFocused,
                },
              }}
            >
              {[
                <MenuItem selected disabled value={''} key={'initial'}>
                  Välj studieinriktning
                </MenuItem>,
                ...FieldOfStudyMenuItems,
              ]}
            </TextField>
            {formik.values.fieldOfStudy === FieldOfStudy.OTHER ? (
              <TextField
                variant={'filled'}
                id={'otherFieldOfStudy'}
                name={'otherFieldOfStudy'}
                label={'Annan studieinriktning'}
                aria-label={'Annan studieinriktning'}
                value={formik.values.otherFieldOfStudy}
                onChange={formik.handleChange}
                error={
                  formik.touched.otherFieldOfStudy &&
                  Boolean(formik.errors.otherFieldOfStudy)
                }
                helperText={
                  formik.touched.otherFieldOfStudy &&
                  formik.errors.otherFieldOfStudy
                }
                className={classes.fields}
                InputLabelProps={{
                  classes: {
                    focused: classes.labelFocused,
                  },
                }}
              />
            ) : (
              <></>
            )}
            {/*
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  id={'capWithTF'}
                  name={'capWithTF'}
                  checked={formik.values.capWithTF}
                  onChange={formik.handleChange}
                  color="secondary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Jag avlägger min phuxfostran vid TF"
              labelPlacement="start"
            />
          </FormGroup>
            */}
          </Box>
          <Box display={'flex'} flexDirection={'column'}>
            <Button
              variant={'contained'}
              type={'submit'}
              className={classes.submitButton}
            >
              Registera dig
            </Button>
            <Typography className={classes.helpText} variant={'body2'}>
              Har du redan ett konto? Logga in
              <Link
                href={Routes.LOGIN}
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
        margin: '0 auto',
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

export default SignupPage;
