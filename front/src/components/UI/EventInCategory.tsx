import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DoneEvent, Event, EventStatus, User } from '../../types';
import * as AuthSelector from '../../selectors/AuthSelectors'
import * as UserService from '../../services/UserServices'
import * as AuthActions from '../../actions/AuthActions'

import { Box, Button } from '@material-ui/core';
import {CheckBoxOutlineBlank, CheckBox} from '@material-ui/icons';
import Togglable from './Togglable';


const EventInCategory = ({event, complitionStatus}: {event: Event, complitionStatus: EventStatus | undefined}) => {
  const dispatch = useDispatch()
  const auth = useSelector(AuthSelector.auth)

  if(!auth.userInfo){
    return(
      <React.Fragment></React.Fragment>
    )
  }

  const requestPoint = async () =>{
    try {
      if(auth.userInfo && auth.userInfo.id){ //For type guard, the button isn't rendered in case no user is autherized
        const addedDoneEvent = await UserService.addDoneEvent(auth.userInfo?.id, event.id, auth.userInfo?.token) as DoneEvent
        dispatch(AuthActions.addUserEvent(addedDoneEvent))
    }
    } catch (error) {
      console.error('Could not complete requestPoint function')
    }
  }

  const unattendedEvent = !auth.userInfo.events.find((dv: DoneEvent) => dv.eventID === event.id)

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
        <br/>{auth.userIsAutharized && unattendedEvent ? <Button variant={'contained'} onClick={requestPoint}>Be om undeskrift</Button> : <React.Fragment></React.Fragment>}
      </Togglable>
    </Box>
  )
}

export default EventInCategory