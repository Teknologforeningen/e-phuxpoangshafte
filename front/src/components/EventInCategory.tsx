import React from 'react';
import { Event } from '../types';

import { Box } from '@material-ui/core';

const EventInCategory = ({event}: {event: Event}) => {
  return(
    <Box border={1}>
      <h3>{event.name}</h3>
      <i>{event.description}</i>
      
      <br/>{event.points? 'Poäng: ' + event.points : ''}
      <br/>{event.userLimit ? 'Högst ' + event.userLimit + ' kan anmäla sig' : ''}
    </Box>
  )
}

export default EventInCategory