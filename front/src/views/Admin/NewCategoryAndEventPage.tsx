import { Box } from '@material-ui/core';
import React from 'react';
import NewCategoryForm from './components/NewCategoryForm';
import NewEventForm from './components/NewEventForm';
import Togglable from '../../components/UI/Togglable';

const NewCatAndEventPage = () => {
  return (
    <Box>
      <Togglable
        buttonLabelOpen={'Lägg till ny kategori'}
        buttonLabelClose={'Stäng kategori'}
      >
        <NewCategoryForm />
      </Togglable>
      <Togglable
        buttonLabelOpen={'Lägg till nytt poäng'}
        buttonLabelClose={'Stäng poäng'}
      >
        <NewEventForm />
      </Togglable>
    </Box>
  );
};

export default NewCatAndEventPage;

//<NewEventForm/>
