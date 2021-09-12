import React, { useEffect, useState } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { DoneEvent, Event, EventStatus, Routes, User } from '../../types';
import * as HashServices from '../../services/HashServices';
import * as UserServices from '../../services/UserServices';
import { useSelector } from 'react-redux';
import * as AuthSelector from '../../selectors/AuthSelectors';
import * as EventSelector from '../../selectors/EventSelectors';
import { CircularProgress, Typography } from '@material-ui/core';
import { ErrorNotification, SuccessNotification } from '../Notifications';

interface RouteType {
  hash: string;
}

const QRvalidation = () => {
  const match = useRouteMatch(Routes.EVENT_VALIDATION);
  const hash = match ? (match.params as RouteType).hash : '';
  const user = useSelector(AuthSelector.auth).userInfo;
  const [valid, setValid] = useState<boolean | null>(null);
  const [eventId, seteventId] = useState<number | null>(null);
  const [done, setDone] = useState<boolean>(false);
  const events = useSelector(EventSelector.allEvents).events;

  useEffect(() => {
    const getAndSetQRcode = async () => {
      const { eventId: eventIdReturned, valid: validReturned } =
        await HashServices.validateHash({ hash });
      setValid(validReturned);
      seteventId(eventIdReturned);
    };
    const addAndupdateStatus = async (user: User, eventId: number) => {
      await UserServices.addDoneEvent(user.id!, eventId);
      const updateResponse = await UserServices.updateUserEventStatus(
        user,
        eventId,
        EventStatus.COMPLETED,
      );
      return updateResponse;
    };
    const updateStatus = async (user: User, eventId: number) => {
      const updateResponse = await UserServices.updateUserEventStatus(
        user,
        eventId,
        EventStatus.COMPLETED,
      );
      return updateResponse;
    };
    getAndSetQRcode();

    if (user && valid && eventId) {
      const userCompletedEvent: DoneEvent | undefined = user.events.find(
        (doneEvent: DoneEvent) => doneEvent.eventID === eventId,
      );
      if (!userCompletedEvent) {
        const response = addAndupdateStatus(user, eventId);
        console.log('Response:', response);
        console.log('Event marked done');
        SuccessNotification(`Poänget har markerats gjort`);
      }
      if (
        userCompletedEvent &&
        userCompletedEvent.status !== EventStatus.COMPLETED
      ) {
        updateStatus(user, eventId);
        SuccessNotification(`Poänget har markerats gjort`);
      }
    }
    setDone(true);
  }, [eventId, hash, user, valid]);

  if (!user) {
    return (
      <Typography>
        Du måste vara inloggad för att kunna accessa denna sida. Om du är
        inloggad och endå ser det här, var god vänta.
      </Typography>
    );
  }
  if (!done) {
    <CircularProgress color="secondary" />;
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

export default QRvalidation;
