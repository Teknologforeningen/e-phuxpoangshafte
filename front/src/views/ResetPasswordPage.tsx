import { resetPassword } from '../services/ResetPasswordServices';
import { Box, TextField, Button, Theme, Typography } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  ErrorNotification,
  SuccessNotification,
} from '../components/Notifications';
import NonAuthNavBar from '../components/Navigation/NonAuthNavBar';

interface LoginCredentials {
  email: string;
}

const ResetPasswordForm = () => {
  const history = useHistory();
  const classes = useStyles();

  const initial: LoginCredentials = {
    email: '',
  };

  const validation = Yup.object({
    email: Yup.string().required('Obligatorisk'),
  });

  const handleSubmit = async (
    values: LoginCredentials,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      await resetPassword({
        email: values.email,
      });
      resetForm();
      SuccessNotification(
        'Ett nytt lösenord har skickats till din e-post, ifall ett konto existerar för den addressen.',
      );
      history.push('/');
    } catch (e: any) {
      ErrorNotification('Något gick fel när återställningen behandlades.');
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
            Återställ lösenord
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
          </Box>
          <Box>
            <Box className={classes.centerAlignRow}>
              <Button
                variant={'contained'}
                className={classes.submitButton}
                type={'submit'}
                size={'large'}
              >
                Återställ lösenord
              </Button>
              <Typography className={classes.helpText} variant={'body2'}>
                Ett nytt lösenord skickas till den valda e-postaddressen, ifall
                ett konto existerar för den addressen.
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

export default ResetPasswordForm;
