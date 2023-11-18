import React from 'react';
import { Box, Button, TextField, Theme } from '@mui/material';
import * as CategoryService from '../../../services/CategoryServices';
import * as CategoryAction from '../../../actions/CategoryActions';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {
  ErrorNotification,
  SuccessNotification,
} from '../../../components/Notifications';
import { makeStyles } from '@mui/styles';
import { maxWidthAdminForms } from '../NewCategoryAndEventPage';

export interface NewCategoryAttributes {
  name: string;
  description: string;
  minPoints?: number;
}

const NewCategoryForm = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const initial: NewCategoryAttributes = {
    name: '',
    description: '',
    minPoints: 0,
  };

  const validation = Yup.object({
    name: Yup.string().required('Obligatorisk'),
    description: Yup.string().required('Obligatorisk'),
    minPoints: Yup.number()
      .required('Obligatorisk')
      .moreThan(-1, 'Måste vara 0 eller större')
      .integer('Måste vara ett heltal'),
  });

  const handleSubmit = async (
    values: NewCategoryAttributes,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      const addedCategory = await CategoryService.addCategory(values);
      dispatch(CategoryAction.addCategory(addedCategory));
      SuccessNotification(`${addedCategory.name} har lagts till!`);
      resetForm({});
    } catch (e) {
      console.error({ error: e, message: 'Could not add new category' });
      ErrorNotification(`${values.name} kunde inte läggas till!`);
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
          id={'name'}
          name={'name'}
          label={'Namn'}
          aria-label={'Name'}
          variant={'outlined'}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          className={classes.fields}
          InputLabelProps={{
            classes: {
              focused: classes.labelFocused,
            },
          }}
        />
        <Box margin={0.5} />
        <TextField
          id={'description'}
          name={'description'}
          label={'Beskrivning'}
          aria-label={'Beskrivning'}
          variant={'outlined'}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          className={classes.fields}
          InputLabelProps={{
            classes: {
              focused: classes.labelFocused,
            },
          }}
        />
        <Box margin={0.5} />
        <TextField
          id={'minPoints'}
          name={'minPoints'}
          type={'number'}
          label={'Poäng'}
          aria-label={'Poäng'}
          placeholder={'0'}
          value={formik.values.minPoints}
          onChange={formik.handleChange}
          error={formik.touched.minPoints && Boolean(formik.errors.minPoints)}
          helperText={formik.touched.minPoints && formik.errors.minPoints}
          className={classes.fields}
          InputLabelProps={{
            classes: {
              focused: classes.labelFocused,
            },
          }}
        />
        <Box display={'flex'} flexDirection={'row'}>
          <Button
            variant={'contained'}
            type={'submit'}
            className={classes.submitButton}
          >
            Lägg till
          </Button>
        </Box>
      </Box>
    </form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  fields: {
    width: '100%',
    maxWidth: maxWidthAdminForms,
    margin: '0 auto',
  },
  submitButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    width: '100%',
    maxWidth: maxWidthAdminForms,
    padding: theme.spacing(2, 0),
    margin: '0 auto',
    borderRadius: 0,
  },
  labelFocused: {
    color: `${theme.palette.common.black} !important`,
  },
}));

export default NewCategoryForm;
