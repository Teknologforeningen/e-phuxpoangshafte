import { Box, Checkbox, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import * as CategorySelector from '../../selectors/CategorySelectors'
import { Category } from '../../types';
import { LocalizationProvider, DateTimePicker } from '@material-ui/lab';
import AdapterLuxon from '@material-ui/lab/AdapterLuxon';
import * as luxon from 'luxon'

interface NewEventAttributes {
  name: string,
  description: string,
  startTime: luxon.DateTime,
  endTime: luxon.DateTime,
  points: number | null,
  userLimit: number | null,
  categoryId?: number,
  mandatory: boolean,
}



const NewEventForm = () => {
  const categories = useSelector(CategorySelector.allCategories)
  const CategoryMenuItems = categories.categories.map((cat:Category) => {
    return( <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)
    })
  const initial: NewEventAttributes = {
    name: '',
    description: '',
    startTime: luxon.DateTime.local(),
    endTime: luxon.DateTime.local(),
    points: 0,
    userLimit: 0,
    mandatory: false,
  }
  const validation = Yup.object({})
  const submit = () => {}

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: submit,
  })
  

  return(
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'} > 
        <Box margin={0.5}/>
        <TextField
          id={'name'}
          name={'name'}
          label={'Name'}
          placeholder={'Poäng namnet'}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}/>
        <Box margin={0.5}/>
        <TextField
          id={'description'}
          name={'description'}
          aria-label={'Beskrivning'}
          placeholder={'Berätta vad poänget handlar om...'}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}/>
        <Box margin={0.5}/>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DateTimePicker
            //id={'startTime'}
            //name={'startTime'}
            //label={'Start tid'}
            value={formik.values.startTime}
            onChange={formik.handleChange}
            renderInput={(props) => <TextField {...props} />}
          />
          <DateTimePicker
            //id={'endTime'}
            //name={'endTime'}
            //label='Slut tid'
            value={formik.values.endTime}
            onChange={formik.handleChange}
            renderInput={(props) => <TextField {...props} />}
          />
        </LocalizationProvider>
        <TextField
          id={'points'}
          name={'points'}
          type={'number'}
          aria-label={'Poäng'}
          placeholder={'0'}
          value={formik.values.points}
          onChange={formik.handleChange}
          error={formik.touched.points && Boolean(formik.errors.points)}
          helperText={formik.touched.points && formik.errors.points}/>
        <Box margin={0.5}/>
        <InputLabel id={'userLimit'}>Max deltagare</InputLabel>
        <TextField
          id={'userLimit'}
          name={'userLimit'}
          type={'number'}
          aria-label={'Max deltagare'}
          placeholder={'0'}
          value={formik.values.userLimit}
          onChange={formik.handleChange}
          error={formik.touched.userLimit && Boolean(formik.errors.userLimit)}
          helperText={formik.touched.userLimit && formik.errors.userLimit}/>
        <Box margin={0.5}/>
        <InputLabel id={'categoryId'}>Kategori</InputLabel>
        <Select
          id={'categoryId'}
          name={'categoryId'}
          aria-label={'Kategori'}
          placeholder={'Kategori...'}
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
          //helperText={formik.touched.categoryId && formik.errors.categoryId}
          >
          {CategoryMenuItems}
        </Select>
        <Box margin={0.5}/>
        <FormGroup row>
          <FormControlLabel
          control= {
            <Checkbox
            id={'mandatory'}
            name={'mandatory'}
            checked={formik.values.mandatory}
            onChange={formik.handleChange}
            color = 'secondary'
            inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          }
          label='Obligatoriskt poäng'
          labelPlacement='start'
          />
        </FormGroup>
      </Box>
    </form>
  )
}

export default NewEventForm