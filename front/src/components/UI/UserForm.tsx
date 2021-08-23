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
import React from 'react';
import * as Yup from 'yup';

import { FieldOfStudy, NewUser, User } from '../../types';
import { ErrorNotification } from '../Notifications';

export interface UserFormAttributes extends NewUser {
  confirmPassword: string;
}

const UserForm = ({
  placeholder = undefined,
  userID,
  submissionButtonLabel = '',
  submitFunction,
}: {
  placeholder?: UserFormAttributes;
  userID?: number;
  submissionButtonLabel: string;
  submitFunction: (values: NewUser, userID?: number) => Promise<any>;
}) => {
  const FieldOfStudyValues = Object.values(FieldOfStudy);
  const FieldOfStudyMenuItems = FieldOfStudyValues.map((item: FieldOfStudy) => (
    <MenuItem>{item}</MenuItem>
  ));

  const initial: UserFormAttributes = {
    email: placeholder ? placeholder.email : '',
    password: '',
    confirmPassword: '',
    firstName: placeholder ? placeholder.firstName : 'Sam',
    lastName: placeholder ? placeholder.lastName : 'Aalto',
    fieldOfStudy: placeholder ? placeholder.fieldOfStudy : '',
    capWithTF: placeholder ? placeholder.capWithTF : true,
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
      const { 'confirmPassword': remove, ...valuesToSend } = values;
      if (userID) {
        const response = await submitFunction(valuesToSend, userID);
      } else {
        const response = await submitFunction(valuesToSend);
      }

      resetForm();
    } catch (e) {
      console.error({ error: e, message: 'Submit failed' });
      ErrorNotification('Något gick fel och din information updaterades inte')
    }
  };

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
          placeholder={placeholder ? placeholder.email : 'exempel@aalto.fi'}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Box margin={0.5} />
        <TextField
          id={'password'}
          name={'password'}
          label={'Lösenord'}
          aria-label={'Lösenord'}
          placeholder={''}
          value={formik.values.password}
          onChange={formik.handleChange}
          //error={formik.touched.password && Boolean(formik.errors.password)}
          //helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          id={'confirmPassword'}
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
          placeholder={placeholder ? placeholder.firstName : 'Sam'}
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
          placeholder={placeholder ? placeholder.lastName : 'Aalto'}
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
            {submissionButtonLabel}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default UserForm;

/*

        */
