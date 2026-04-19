import React from 'react';
import { Box, Button, TextField, Theme } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import * as SiteSettingsSelectors from '../../../selectors/SiteSettingsSelectors';
import * as SiteSettingsServices from '../../../services/SiteSettingsServices';
import { updateSiteSettings } from '../../../actions/SiteSettingsActions';
import {
  ErrorNotification,
  SuccessNotification,
} from '../../../components/Notifications';
import { makeStyles } from '@mui/styles';
import { maxWidthAdminForms } from '../NewCategoryAndEventPage';

const SiteSettingsForm = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const settingsState = useSelector(SiteSettingsSelectors.siteSettings);
  const settings = settingsState.settings;

  const initial = {
    totalMinPoints: settings?.totalMinPoints ?? 300,
  };

  const validation = Yup.object({
    totalMinPoints: Yup.number()
      .required('Obligatorisk')
      .min(0, 'Måste vara 0 eller större')
      .integer('Måste vara ett heltal'),
  });

  const handleSubmit = async (values: { totalMinPoints: number }) => {
    try {
      const updated = await SiteSettingsServices.updateSiteSettings({
        totalMinPoints: values.totalMinPoints,
      });
      dispatch(updateSiteSettings(updated));
      SuccessNotification('Inställningarna har uppdaterats!');
    } catch (e) {
      console.error({ error: e, message: 'Could not update site settings' });
      ErrorNotification('Inställningarna kunde inte uppdateras!');
    }
  };

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  if (!settings) {
    return <p>Laddar inställningar...</p>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'}>
        <Box margin={0.5} />
        <TextField
          id={'totalMinPoints'}
          name={'totalMinPoints'}
          type={'number'}
          label={'Totala minimipoäng'}
          aria-label={'Totala minimipoäng'}
          placeholder={'300'}
          value={formik.values.totalMinPoints}
          onChange={event =>
            formik.setFieldValue(
              'totalMinPoints',
              event.target.value === ''
                ? undefined
                : event.target.valueAsNumber,
            )
          }
          error={
            formik.touched.totalMinPoints &&
            Boolean(formik.errors.totalMinPoints)
          }
          helperText={
            (formik.touched.totalMinPoints && formik.errors.totalMinPoints) ||
            'Minsta antal poäng en phux måste samla totalt över alla kategorier.'
          }
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

export default SiteSettingsForm;
