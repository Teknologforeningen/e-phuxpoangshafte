import React, { useEffect, useState } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { DoneEvent, EventStatus, Routes, User } from '../../types';
import * as HashServices from '../../services/HashServices';
import * as UserServices from '../../services/UserServices';
import { useSelector } from 'react-redux';
import * as AuthSelector from '../../selectors/AuthSelectors';
import * as EventSelector from '../../selectors/EventSelectors';
import { Box, CircularProgress, Theme, Typography } from '@material-ui/core';
import { ErrorNotification, SuccessNotification } from '../Notifications';
import { createStyles, makeStyles } from '@material-ui/styles';

interface RouteType {
  hash: string;
}

const QRvalidation = () => {
  const classes = useStyles();
  const match = useRouteMatch(Routes.EVENT_VALIDATION);
  const hash = match ? (match.params as RouteType).hash : '';
  const user = useSelector(AuthSelector.auth).userInfo;
  const [valid, setValid] = useState<boolean | null>(null);
  const [eventId, seteventId] = useState<number | null>(null);
  const [done, setDone] = useState<boolean>(false);
  const events = useSelector(EventSelector.allEvents).events;

  useEffect(() => {
    const validateHash = async () => {
      const { eventId: eventIdReturned, valid: validReturned } =
        await HashServices.validateHash({ hash });
      setValid(validReturned);
      seteventId(eventIdReturned);
    };
    validateHash();
  }, [hash]);

  useEffect(() => {
    const addAndUpdateStatus = async (user: User, eventId: number) => {
      try {
        await UserServices.addDoneEvent(user.id!, eventId);
        const updateResponse = await UserServices.updateUserEventStatus(
          user,
          eventId,
          EventStatus.COMPLETED,
        );
        setDone(true);
        return updateResponse;
      } catch (e) {
        console.error('error', e);
      }
    };
    const updateStatusToCompleted = async (user: User, eventId: number) => {
      try {
        const updateResponse = await UserServices.updateUserEventStatus(
          user,
          eventId,
          EventStatus.COMPLETED,
        );
        setDone(true);
        return updateResponse;
      } catch (e) {
        console.error('error', e);
      }
    };

    if (user && valid && eventId) {
      const userCompletedEvent: DoneEvent | undefined = user.events.find(
        (doneEvent: DoneEvent) => doneEvent.eventID === eventId,
      );
      if (!userCompletedEvent) {
        const response = addAndUpdateStatus(user, eventId);
        console.log('Response:', response);
        console.log('Event marked done');
        SuccessNotification(`Poänget har markerats gjort`);
      }
      if (
        userCompletedEvent &&
        userCompletedEvent.status !== EventStatus.COMPLETED
      ) {
        updateStatusToCompleted(user, eventId);
        SuccessNotification(`Poänget har markerats gjort`);
      }
    }
  }, [user, valid, eventId]);

  if (!user) {
    return (
      <Typography variant={'h5'}>
        Du måste vara inloggad för att kunna accessa denna sida. Om du är
        inloggad och endå ser det här, var god vänta.
      </Typography>
    );
  }
  if (!done) {
    <Box className={classes.centerBox}>
      <CircularProgress color="secondary" className={classes.loadingSpinner} />;
    </Box>;
  }
  if (done && valid === true) {
    return <Redirect to={Routes.ROOT} />;
  }
  if (done && valid === false) {
    ErrorNotification('Koden är inte längre giltig');
    return <Redirect to={Routes.ROOT} />;
  }

  return <></>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    centerBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingSpinner: {
      width: '100%',
      height: '100%',
    },
  }),
);

export default QRvalidation;
