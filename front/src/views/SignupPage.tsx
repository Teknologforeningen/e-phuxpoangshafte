import React from 'react';
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
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as UserService from '../services/UserServices';
import { FieldOfStudy, NewUser } from '../types';
import * as Yup from 'yup';

export interface UserFormAttributes extends NewUser {
  confirmPassword: string;
}

const SignupPage = () => {
  const history = useHistory();

  const FieldOfStudyValues = Object.values(FieldOfStudy);
  const FieldOfStudyMenuItems = FieldOfStudyValues.map((item: FieldOfStudy) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ));

  const handleSubmit = async (values: NewUser) => {
    try {
      console.log('Submit initiated');
      const response = await UserService.addUser(values);
      history.push('/successfulsignup');
      return response;
    } catch (e) {
      console.error({ message: 'Could not add new user', error: e });
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

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'}>
        <Box margin={0.5} />
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
          placeholder={''}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
        />
        <TextField
          id={'confirmPassword'}
          type={'password'}
          name={'confirmPassword'}
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
          placeholder={'Sam'}
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
          placeholder={'Aalto'}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <Box margin={0.5} />
        <Box margin={0.5} />
        <InputLabel id={'fieldOfStudy'}>Studieinrikting</InputLabel>
        <Select
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
        >
          {[
            <MenuItem selected disabled value={''} key={'initial'}>
              Välj studieinriktning
            </MenuItem>,
            ...FieldOfStudyMenuItems,
          ]}
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
            Registera dig
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default SignupPage;
