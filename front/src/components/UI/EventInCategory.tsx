import React from 'react';
import { useSelector } from 'react-redux';
import { authDetails, DoneEvent, Event, EventStatus } from '../../types';
import * as AuthSelector from '../../selectors/AuthSelectors'

import { Box } from '@material-ui/core';
import {CheckBoxOutlineBlank, CheckBox} from '@material-ui/icons';
import Togglable from './Togglable';


const EventInCategory = ({event, complitionStatus}: {event: Event, complitionStatus: EventStatus | undefined}) => {
  const statusIcon = complitionStatus && complitionStatus === EventStatus.COMPLETED
  ? <CheckBox/>
  : <CheckBoxOutlineBlank />
  return(
    <Box border={1}>
      <h3>{event.name} {statusIcon}</h3>
      <Togglable buttonLabelOpen={'Visa detaljer'} buttonLabelClose={'Stäng detaljer'}>
        <i>{event.description}</i>
        <br/>{event.points? 'Poäng: ' + event.points : ''}
        <br/>{event.userLimit ? 'Högst ' + event.userLimit + ' kan anmäla sig' : ''}
      </Togglable>
    </Box>
  )
}

export default EventInCategory