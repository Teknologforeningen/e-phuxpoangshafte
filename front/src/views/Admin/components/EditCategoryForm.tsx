import React from 'react';
import { Box, Button, MenuItem, TextField, Theme } from '@material-ui/core';
import * as CategorySelector from '../../../selectors/CategorySelectors';
import * as CategoryService from '../../../services/CategoryServices';
import * as CategoryAction from '../../../actions/CategoryActions';
import * as AuthSelector from '../../../selectors/AuthSelectors';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  ErrorNotification,
  SuccessNotification,
} from '../../../components/Notifications';
import { NewCategoryAttributes } from './NewCategoryForm';
import { Category } from '../../../types';
import { makeStyles } from '@material-ui/styles';
import { maxWidthAdminForms } from '../NewCategoryAndEventPage';

export interface EditCategoryAttributes extends NewCategoryAttributes {
  categoryId?: number | '';
}

const EditCategoryForm = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const categories = useSelector(CategorySelector.allCategories).categories;
  const CategoryMenuItems = categories.map((cat: Category) => {
    return (
      <MenuItem key={cat.id} value={cat.id}>
        {cat.name}
      </MenuItem>
    );
  });

  const findCategory = (categoryId: number) =>
    categories.find((category: Category) => category.id === categoryId);

  const initial: EditCategoryAttributes = {
    categoryId: '',
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
    values: EditCategoryAttributes,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      const addedCategory = await CategoryService.editCategory(values);
      //dispatch(CategoryAction.addCategory(addedCategory));
      SuccessNotification(`${addedCategory.name} har updaterats!`);
      resetForm({});
    } catch (e) {
      console.error({ error: e, message: 'Could not update the category' });
      ErrorNotification(`${values.name} kunde inte uppdateras!`);
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
          select
          id={'categoryId'}
          name={'categoryId'}
          label={'Poäng'}
          aria-label={'Poäng'}
          placeholder={'Poäng...'}
          value={formik.values.categoryId}
          onChange={e => {
            formik.handleChange(e);
            const foundCateogry: Category | undefined = findCategory(
              Number(e.target.value),
            );
            if (foundCateogry) {
              formik.setFieldValue('name', foundCateogry.name);
              formik.setFieldValue('description', foundCateogry.description);
              formik.setFieldValue(
                'minPoints',
                foundCateogry.minPoints ? foundCateogry.minPoints : 0,
              );
            }
          }}
          error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
          helperText={formik.touched.categoryId && formik.errors.categoryId}
          className={classes.fields}
          InputLabelProps={{
            classes: {
              focused: classes.labelFocused,
            },
          }}
        >
          {CategoryMenuItems}categoryId
        </TextField>
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
          multiline
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
            Uppdatera
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

export default EditCategoryForm;
