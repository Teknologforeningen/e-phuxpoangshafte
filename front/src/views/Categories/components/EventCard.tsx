import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DoneEvent,
  Event,
  EventStatus,
  Routes,
  userRole,
} from '../../../types';
import * as AuthSelector from '../../../selectors/AuthSelectors';
import * as UserService from '../../../services/UserServices';
import * as AuthActions from '../../../actions/AuthActions';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  Theme,
  Typography,
} from '@material-ui/core';
import { Done, DoneAll, Close } from '@material-ui/icons';
import {
  ErrorNotification,
  InfoNotification,
} from '../../../components/Notifications';
import { createStyles, makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import LockIcon from '@material-ui/icons/Lock';

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
          {event.name}{' '}
          {event.mandatory && <LockIcon className={classes.lockIcon} />}
        </Typography>
        {event.points && (
          <Typography variant={'body2'} className={classes.titleText}>
            {event.points} poäng{' '}
          </Typography>
        )}
      </Box>
      <Box className={classes.titleIcon}>{icon}</Box>
    </Box>
  );
};

const EventCard = ({
  event,
  complitionStatus,
  selectCardId,
  setSelectCardId,
}: {
  event: Event;
  complitionStatus: EventStatus | undefined;
  selectCardId: number;
  setSelectCardId: (id: number) => void;
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(AuthSelector.auth);

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
        )) as DoneEvent;
        dispatch(AuthActions.addUserEvent(addedDoneEvent));
        InfoNotification(`Din begäran för ${event.name} har skickats`);
      }
    } catch (error) {
      console.error('Could not complete requestPoint function');
      ErrorNotification(`Din begäran för ${event.name} kunde inte behandlas`);
    }
  };

  const eventStatus = auth.userInfo.events.find(
    (dv: DoneEvent) => dv.eventID === event.id,
  )?.status;

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

  const selectedCard = event.id === selectCardId;

  return (
    <Card
      className={classNames(classes.card, {
        [classes.selectedCard]: selectedCard,
      })}
      onClick={() => setSelectCardId(event.id)}
    >
      <CardHeader title={<EventCardTitle event={event} icon={statusIcon} />} />
      {selectedCard && (
        <CardContent className={classes.cardContent}>
          <Box className={classes.information}>
            <Typography variant={'body2'}>
              <i>{event.description}</i>
            </Typography>
            <Typography variant={'body2'}>
              {event.userLimit
                ? 'Högst ' + event.userLimit + ' kan anmäla sig'
                : ''}
            </Typography>
          </Box>
          {auth.userIsAutharized &&
          unattendedEvent &&
          auth.userInfo.role !== userRole.ADMIN ? (
            <Button
              variant={'contained'}
              onClick={requestPoint}
              className={classes.actionButton}
            >
              Underskrift
            </Button>
          ) : eventStatus === 'PENDING' ? (
            <Typography variant="caption" fontStyle={'italic'}>
              Väntar på underskrift
            </Typography>
          ) : undefined}
          {auth.userIsAutharized && auth.userInfo.role === userRole.ADMIN ? (
            <Link
              href={`${Routes.EVENT_GENERATION}/${event.id}`}
              underline={'none'}
            >
              <Button variant={'contained'} className={classes.actionButton}>
                Hämta QR kod
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </CardContent>
      )}
    </Card>
  );
};

const useStyles = makeStyles(
  (theme: Theme) =>
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
      titleIcon: {
        display: 'flex',
      },
      incompleteIcon: {
        border: `2px solid black`,
        borderRadius: 24,
      },
      actionButton: {
        flex: '0 1 0',
        marginLeft: theme.spacing(1),
        minWidth: 120,
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2, 2),
      },
      card: {
        margin: '24px 0px',
      },
      cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0, 2, 2, 2),
      },
      information: {
        flex: '1 1 0',
      },
      selectedCard: {
        border: `2px solid ${theme.palette.secondary.main}`,
      },
      lockIcon: {
        height: 24,
        width: 12,
        color: theme.palette.primary.contrastText,
      },
    }),
  { index: 1 },
);

export default EventCard;
