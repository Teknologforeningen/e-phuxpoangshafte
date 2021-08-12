import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import * as CategoryService from '../../../services/CategoryServices';
import * as CategoryAction from '../../../actions/CategoryActions';
import * as AuthSelector from '../../../selectors/AuthSelectors';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';

export interface NewCategoryAttributes {
  name: string;
  description: string;
  minPoints?: number;
}

const NewCategoryForm = () => {
  const dispatch = useDispatch();
  const token = useSelector(AuthSelector.token);

  const initial: NewCategoryAttributes = {
    name: '',
    description: '',
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
      const addedCategory = await CategoryService.addCategory(values, token);
      dispatch(CategoryAction.addCategory(addedCategory));
      resetForm({});
    } catch (e) {
      console.error({ error: e, message: 'Could not add new category' });
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
        />
        <Box display={'flex'} flexDirection={'row'}>
          <Button variant={'contained'} type={'submit'}>
            Lägg till
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default NewCategoryForm;
