import React from 'react';
import UserForm from '../../components/UI/UserForm';
import * as UserService from '../../services/UserServices';
import * as AuthSelector from '../../selectors/AuthSelectors';
import { useSelector } from 'react-redux';
import { FieldOfStudy, NewUser } from '../../types';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { SuccessNotification } from '../../components/Notifications';

export interface UserFormAttributes extends NewUser {
  confirmPassword: string;
}

const UserSettings = () => {
  const auth = useSelector(AuthSelector.auth);

  const currentValues = {
    email: auth.userInfo ? auth.userInfo.email : '',
    password: '',
    confirmPassword: '',
    firstName: auth.userInfo ? auth.userInfo.firstName : '',
    lastName: auth.userInfo ? auth.userInfo.lastName : '',
    fieldOfStudy: auth.userInfo ? auth.userInfo.fieldOfStudy : '',
    capWithTF: auth.userInfo ? auth.userInfo.capWithTF : true,
  };

  const FieldOfStudyValues = Object.values(FieldOfStudy);
  const FieldOfStudyMenuItems = FieldOfStudyValues.map((item: FieldOfStudy) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ));

  const initial: UserFormAttributes = {
    email: currentValues.email,
    password: '',
    confirmPassword: '',
    firstName: currentValues.firstName,
    lastName: currentValues.lastName,
    fieldOfStudy: currentValues.fieldOfStudy,
    capWithTF: currentValues.capWithTF,
  };

  const validation = Yup.object({
    email: Yup.string()
      .email('Måste vara av formen exempel@domain.com')
      .required('Obligatorisk'),
    password: Yup.string()
      .required('Obligatorisk')
      .min(5, 'Lösen ordet måste vara mist 5 tecken långt')
      .oneOf(
        [Yup.ref('confirmPassword'), null],
        'Lösenorden är inte identiska!',
      ),
    confirmPassword: Yup.string()
      .required('Lösenorden är inte identiska!')
      .oneOf([Yup.ref('password'), null], "Passwords don't match!"),
    firstName: Yup.string().required('Obligatorisk'),
    lastName: Yup.string().required('Obligatorisk'),
    fieldOfStudy: Yup.string().required('Obligatorisk'),
  });
  const handleSubmit = async (
    values: UserFormAttributes,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      const { confirmPassword: remove, ...valuesToSend } = values;
      if (auth.userInfo && auth.userInfo.id) {
        const response = await UserService.updateUser(
          valuesToSend,
          auth.userInfo.id,
        );
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

  if (!auth.userIsAutharized || !auth.userInfo) {
    return <></>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'}>
        <Box margin={0.5} />
        <TextField
          id={'email'}
          name={'email'}
          label={'Email'}
          aria-label={'Email'}
          placeholder={currentValues ? currentValues.email : 'exempel@aalto.fi'}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
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
        />
        <Box margin={0.5} />
        <Box margin={0.5} />
        <InputLabel id={'categoryId'}>Kategori</InputLabel>
        <Select
          id={'fieldOfStudy'}
          name={'fieldOfStudy'}
          label={'Studie inriktning'}
          aria-label={'Studie inrikting'}
          placeholder={'Välj studie inriktning'}
          value={formik.values.fieldOfStudy}
          onChange={formik.handleChange}
          error={
            formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)
          }
        >
          {FieldOfStudyMenuItems}
        </Select>
        <Box margin={0.5} />
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
        <Box display={'flex'} flexDirection={'row'}>
          <Button variant={'contained'} type={'submit'}>
            Updatera information
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default UserSettings;

/*<UserForm
placeholder={placeholder}
userID = {auth.userInfo.id}
submissionButtonLabel={'Updatera'}
submitFunction={UserService.updateUser}
/>*/