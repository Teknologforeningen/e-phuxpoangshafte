import React from 'react';
import { Box } from '@material-ui/core';
import NewCategoryForm from './components/NewCategoryForm';
import NewEventForm from './components/NewEventForm';
import Togglable from '../../components/UI/Togglable';
import EditEventForm from './components/EditEventForm';
import EditCategoryForm from './components/EditCategoryForm';

const NewCatAndEventPage = () => {
  return (
    <Box>
      <Togglable
        buttonLabelOpen={'Lägg till ny kategori'}
        buttonLabelClose={'Stäng'}
      >
        <NewCategoryForm />
      </Togglable>
      <Togglable
        buttonLabelOpen={'Lägg till nytt poäng'}
        buttonLabelClose={'Stäng'}
      >
        <NewEventForm />
      </Togglable>
      <Togglable
        buttonLabelOpen={'Ändra/Ta bort kategori'}
        buttonLabelClose={'Stäng'}
      >
        <EditCategoryForm />
      </Togglable>
      <Togglable
        buttonLabelOpen={'Ändra/Ta bort poäng'}
        buttonLabelClose={'Stäng'}
      >
        <EditEventForm />
      </Togglable>
    </Box>
  );
};

export default NewCatAndEventPage;

//<NewEventForm/>
