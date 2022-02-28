import React from 'react';
import { Box, Button, TextField, Theme, MenuItem } from '@material-ui/core';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import * as ServiServices from '../../../services/ServiServices';
import * as ServiActions from '../../../actions/ServiActions';
import * as ServiSelectors from '../../../selectors/ServiSelectors';
import { Servi } from '../../../types';
import { LocalizationProvider, DateTimePicker } from '@material-ui/lab';
import AdapterLuxon from '@material-ui/lab/AdapterLuxon';
import * as luxon from 'luxon';
import {
  ErrorNotification,
  SuccessNotification,
} from '../../../components/Notifications';
import { NewServiAttributes } from './NewServiForm';
import { makeStyles } from '@material-ui/styles';
import { maxWidthAdminForms } from '../NewCategoryAndEventPage';

export interface EditedServiAttributes extends NewServiAttributes {
  serviId?: number | '';
}

const EditServiForm = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const servis = useSelector(ServiSelectors.allServis).servis;
  const EventMenuItems = servis.map((servi: Servi) => {
    return (
      <MenuItem key={servi.id} value={servi.id}>
        {servi.name}
      </MenuItem>
    );
  });
  const initial: EditedServiAttributes = {
    serviId: '',
    name: '',
    description: '',
    startTime: luxon.DateTime.local(),
    endTime: luxon.DateTime.local(),
    points: 0,
    userLimit: 0,
  };

  const validation = Yup.object({
    name: Yup.string().required('Obligatorisk'),
    description: Yup.string().required('Obligatorisk'),
    startTime: Yup.date().required('Obligatorisk'),
    //.min(luxon.DateTime.local(), 'Datumet måst vara i framtiden'),
    endTime: Yup.date().required('Obligatorisk'),
    //.min(luxon.DateTime.local(), 'Datumet måst vara i framtiden'),
    points: Yup.number()
      .moreThan(-1, 'Måste vara 0 eller större')
      .integer('Måste vara ett heltal')
      .required('Obligatorisk'),
    userLimit: Yup.number()
      .moreThan(-1, 'Måste vara 0 eller större')
      .integer('Måste vara ett heltal'),
  });
  const handleSubmit = async (
    values: EditedServiAttributes,
    { resetForm }: { resetForm: any },
  ) => {
    try {
      const editedServi = await ServiServices.editServi(values);
      dispatch(ServiActions.editServi(editedServi));
      SuccessNotification(`${editedServi.name} har updaterats!`);
      resetForm();
    } catch (e) {
      console.error({ error: e, message: 'Could not update the event' });
      ErrorNotification(`${values.name} kunde inte updateras!`);
    }
  };

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: handleSubmit,
  });

  const findServi = (serviId: number) =>
    servis.find((servi: Servi) => servi.id === serviId);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'}>
        <Box margin={0.5} />
        <TextField
          select
          id={'serviId'}
          name={'serviId'}
          label={'Servi'}
          aria-label={'Servi'}
          placeholder={'Servi...'}
          value={formik.values.serviId}
          onChange={e => {
            formik.handleChange(e);
            const foundServi: Servi | undefined = findServi(
              Number(e.target.value),
            );
            if (foundServi) {
              formik.setFieldValue('name', foundServi.name);
              formik.setFieldValue('description', foundServi.description);
              formik.setFieldValue('startTime', foundServi.startTime);
              formik.setFieldValue('endTime', foundServi.endTime);
              formik.setFieldValue('points', foundServi.points);
              formik.setFieldValue(
                'userLimit',
                foundServi.userLimit ? foundServi.userLimit : 0,
              );
            }
          }}
          error={formik.touched.serviId && Boolean(formik.errors.serviId)}
          helperText={formik.touched.serviId && formik.errors.serviId}
          className={classes.fields}
          InputLabelProps={{
            classes: {
              focused: classes.labelFocused,
            },
          }}
        >
          {EventMenuItems}
        </TextField>
        <Box margin={0.5} />
        <TextField
          id={'name'}
          name={'name'}
          label={'Namn'}
          aria-label={'Name'}
          placeholder={'Poäng namnet'}
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
          placeholder={'Berätta vad poänget handlar om...'}
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
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DateTimePicker
            label={'Start tid'}
            ampm={false}
            value={formik.values.startTime}
            onChange={newValue => formik.setFieldValue('startTime', newValue)}
            renderInput={props => (
              <TextField
                {...props}
                error={
                  formik.touched.startTime && Boolean(formik.errors.startTime)
                }
                helperText={formik.touched.startTime && formik.errors.startTime}
                className={classes.fields}
                InputLabelProps={{
                  classes: {
                    focused: classes.labelFocused,
                  },
                }}
              />
            )}
          />
          <Box margin={0.5} />
          <DateTimePicker
            label="Slut tid"
            ampm={false}
            value={formik.values.endTime}
            onChange={newValue => formik.setFieldValue('endTime', newValue)}
            renderInput={props => (
              <TextField
                {...props}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                className={classes.fields}
                InputLabelProps={{
                  classes: {
                    focused: classes.labelFocused,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
        <Box margin={0.5} />
        <TextField
          id={'points'}
          name={'points'}
          type={'number'}
          label={'Poäng'}
          aria-label={'Poäng'}
          placeholder={'0'}
          value={formik.values.points}
          onChange={formik.handleChange}
          error={formik.touched.points && Boolean(formik.errors.points)}
          helperText={formik.touched.points && formik.errors.points}
          className={classes.fields}
          InputLabelProps={{
            classes: {
              focused: classes.labelFocused,
            },
          }}
        />
        <Box margin={0.5} />
        <TextField
          id={'userLimit'}
          name={'userLimit'}
          type={'number'}
          label={'Max deltagare'}
          aria-label={'Max deltagare'}
          placeholder={'0'}
          value={formik.values.userLimit}
          onChange={formik.handleChange}
          error={formik.touched.userLimit && Boolean(formik.errors.userLimit)}
          helperText={formik.touched.userLimit && formik.errors.userLimit}
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
            Updatera
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

export default EditServiForm;
