import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DoneEvent, Event, EventStatus } from '../../../types';
import * as AuthSelector from '../../../selectors/AuthSelectors';
import * as UserService from '../../../services/UserServices';
import * as AuthActions from '../../../actions/AuthActions';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  Theme,
  Typography,
} from '@material-ui/core';
import { Done, DoneAll, Close } from '@material-ui/icons';
import {
  ErrorNotification,
  InfoNotification,
} from '../../../components/Notifications';
import { createStyles, makeStyles } from '@material-ui/styles';

const EventCardTitle = ({
  event,
  icon,
}: {
  event: Event;
  icon: JSX.Element;
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.horizontalSpacer}>
      <Box className={classes.titleText}>
        <Typography variant={'h6'} color={'secondary'}>
          {event.name}
        </Typography>
        {event.points ? (
          <Typography variant={'body2'} className={classes.titleText}>
            {event.points} poäng{' '}
          </Typography>
        ) : (
          ''
        )}
      </Box>
      <Box className={classes.titleIcon}>{icon}</Box>
    </Box>
  );
};

const EventCard = ({
  event,
  complitionStatus,
}: {
  event: Event;
  complitionStatus: EventStatus | undefined;
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
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
      <DoneAll color={'success'} />
    ) : complitionStatus === EventStatus.PENDING ||
      complitionStatus === EventStatus.CONFIRMED ? (
      <Done color={'warning'} />
    ) : (
      <Close className={classes.incompleteIcon} />
    );

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleExpandClick}>
        <CardHeader
          title={<EventCardTitle event={event} icon={statusIcon} />}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant={'body2'}>
              <i>{event.description}</i>
            </Typography>
            <Typography variant={'body2'}>
              {event.userLimit
                ? 'Högst ' + event.userLimit + ' kan anmäla sig'
                : ''}
            </Typography>
            {auth.userIsAutharized && unattendedEvent && expanded ? (
              <Button
                variant={'contained'}
                onClick={requestPoint}
                className={classes.actionButton}
              >
                Be om undeskrift
              </Button>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </CardContent>
        </Collapse>
      </CardActionArea>
    </Card>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    horizontalSpacer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    titleText: {
      fontWeight: 800,
    },
    titleIcon: {},
    incompleteIcon: {
      border: `2px solid black`,
      borderRadius: 24,
    },
    actionButton: {
      zIndex: 1301,
    },
    card: {
      margin: '24px 0px',
    },
  }),
);

export default EventCard;
