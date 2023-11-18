import React from 'react';
import * as UserService from '../../services/UserServices';
import { auth } from '../../selectors/AuthSelectors';
import { useSelector } from 'react-redux';
import { FieldOfStudy, NewUser } from '../../types';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
  Theme,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { SuccessNotification } from '../../components/Notifications';
import { makeStyles, createStyles } from '@mui/styles';

export interface UserFormAttributes extends NewUser {
  confirmPassword: string;
}

const UserSettings = () => {
  const authentication = useSelector(auth);
  const classes = useStyles();
  const currentValues = {
    email: authentication.userInfo ? authentication.userInfo.email : '',
    password: '',
    confirmPassword: '',
    firstName: authentication.userInfo ? authentication.userInfo.firstName : '',
    lastName: authentication.userInfo ? authentication.userInfo.lastName : '',
    fieldOfStudy: authentication.userInfo
      ? authentication.userInfo.fieldOfStudy
      : '',
    capWithTF: authentication.userInfo
      ? authentication.userInfo.capWithTF
      : true,
  };

  const FieldOfStudyValues = Object.values(FieldOfStudy);
  const FieldOfStudyMenuItems = FieldOfStudyValues.map((item: FieldOfStudy) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ));

  const hasListedFieldOfStudy = FieldOfStudyValues.map((item: FieldOfStudy) =>
    String(item),
  ).includes(currentValues.fieldOfStudy);

  const initial: UserFormAttributes = {
    email: currentValues.email,
    password: '',
    confirmPassword: '',
    firstName: currentValues.firstName,
    lastName: currentValues.lastName,
    fieldOfStudy: hasListedFieldOfStudy
      ? currentValues.fieldOfStudy
      : FieldOfStudy.OTHER,
    otherFieldOfStudy: !hasListedFieldOfStudy
      ? currentValues.fieldOfStudy
      : undefined,
    capWithTF: currentValues.capWithTF,
  };

  const validation = Yup.object({
    email: Yup.string().email('Måste vara av formen exempel@domain.com'),
    password: Yup.string()
      .min(5, 'Lösen ordet måste vara mist 5 tecken långt')
      .oneOf(
        [Yup.ref('confirmPassword'), null],
        'Lösenorden är inte identiska!',
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      "Passwords don't match!",
    ),
    firstName: Yup.string(),
    lastName: Yup.string(),
    fieldOfStudy: Yup.string(),
    otherFieldOfStudy: Yup.string(),
  });
  const handleSubmit = async (
    values: UserFormAttributes,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      const { confirmPassword: remove, ...valuesToSend } = values;
      if (authentication.userInfo && authentication.userInfo.id) {
        await UserService.updateUser(valuesToSend, authentication.userInfo.id);
        SuccessNotification('Din information har uppdaterats');
      } else {
        console.error({
          error: 'NoAutharizedUser',
          message:
            'auth.userInfo was not defined when trying to submit the form',
        });
      }
    } catch (e) {
      console.error({ error: e, message: 'Submit failed' });
    }
  };

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  if (!authentication.userIsAutharized || !authentication.userInfo) {
    return <></>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.loginSpread}>
        <Box display={'flex'} flexDirection={'column'}>
          <Box margin={0.5} />
          <TextField
            id={'email'}
            name={'email'}
            label={'Email'}
            aria-label={'Email'}
            placeholder={
              currentValues ? currentValues.email : 'exempel@aalto.fi'
            }
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
          <Box margin={0.5} />
          <TextField
            id={'password'}
            name={'password'}
            type={'password'}
            label={'Lösenord'}
            aria-label={'Lösenord'}
            placeholder={''}
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
            id={'confirmPassword'}
            name={'confirmPassword'}
            type={'password'}
            label={'Bekräfta lösenord'}
            aria-label={'Bekräfta lösenord'}
            placeholder={''}
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
          <Box margin={0.5} />
          <TextField
            id={'firstName'}
            name={'firstName'}
            label={'Förnamn'}
            aria-label={'Förnamn'}
            placeholder={currentValues ? currentValues.firstName : 'Sam'}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            className={classes.fields}
            InputLabelProps={{
              classes: {
                focused: classes.labelFocused,
              },
            }}
          />
          <Box margin={0.5} />
          <TextField
            id={'lastName'}
            name={'lastName'}
            label={'Efternamn'}
            aria-label={'Efternamn'}
            placeholder={currentValues ? currentValues.lastName : 'Aalto'}
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
          <Box margin={0.5} />
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
              formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)
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
            {FieldOfStudyMenuItems}
          </TextField>
          <Box margin={0.5} />
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
          <FormGroup row>
            <FormControlLabel
              className={classes.fields}
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
          <Box display={'flex'} flexDirection={'row'}>
            <Button
              variant={'contained'}
              type={'submit'}
              className={classes.submitButton}
            >
              Updatera information
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
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

export default UserSettings;
