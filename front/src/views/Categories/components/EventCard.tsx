import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DoneEvent, Event, EventStatus } from '../../../types';
import * as AuthSelector from '../../../selectors/AuthSelectors';
import * as UserService from '../../../services/UserServices';
import * as AuthActions from '../../../actions/AuthActions';
import {
  Button,
  Card,
  CardActionArea,
  CardHeader,
  Collapse,
  Typography,
} from '@material-ui/core';
import {
  CheckBoxOutlineBlank,
  CheckBox,
  IndeterminateCheckBox,
} from '@material-ui/icons';
import {
  ErrorNotification,
  InfoNotification,
} from '../../../components/Notifications';

const EventCard = ({
  event,
  complitionStatus,
}: {
  event: Event;
  complitionStatus: EventStatus | undefined;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();
  const auth = useSelector(AuthSelector.auth);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!auth.userInfo) {
    return <React.Fragment></React.Fragment>;
  }

  const requestPoint = async () => {
    try {
      if (auth.userInfo && auth.userInfo.id) {
        //For type guard, the button isn't rendered in case no user is autherized
        console.log('UserID:', auth.userInfo.id);
        console.log('EventID:', event.id);
        const addedDoneEvent = (await UserService.addDoneEvent(
          auth.userInfo.id,
          event.id,
          auth.userInfo.token,
        )) as DoneEvent;
        dispatch(AuthActions.addUserEvent(addedDoneEvent));
        InfoNotification(`Din begäran för ${event.name} har skickats`);
      }
    } catch (error) {
      console.error('Could not complete requestPoint function');
      ErrorNotification(`Din begäran för ${event.name} kunde inte behandlas`);
    }
  };

  const unattendedEvent = !auth.userInfo.events.find(
    (dv: DoneEvent) => dv.eventID === event.id,
  );

  const statusIcon =
    complitionStatus && complitionStatus === EventStatus.COMPLETED ? (
      <CheckBox />
    ) : complitionStatus === EventStatus.PENDING ||
      complitionStatus === EventStatus.CONFIRMED ? (
      <IndeterminateCheckBox />
    ) : (
      <CheckBoxOutlineBlank />
    );

  return (
    <Card>
      <CardActionArea onClick={handleExpandClick}>
        <CardHeader title={event.name} avatar={statusIcon} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography paragraph>
            <i>{event.description}</i>
          </Typography>
          <Typography paragraph>
            {event.points ? 'Poäng: ' + event.points : ''}
          </Typography>
          <Typography paragraph>
            {event.userLimit
              ? 'Högst ' + event.userLimit + ' kan anmäla sig'
              : ''}
          </Typography>
        </Collapse>
      </CardActionArea>
      {auth.userIsAutharized && unattendedEvent && expanded ? (
        <Button variant={'contained'} onClick={requestPoint}>
          Be om undeskrift
        </Button>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </Card>
  );
};

export default EventCard;
