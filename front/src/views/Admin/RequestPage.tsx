import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';

import { User, DoneEvent, Event, EventStatus } from '../../types';

import * as UserService from '../../services/UserServices';
import * as EventService from '../../services/EventServices';
import { ensure } from '../../utils.ts/HelperFunctions';
import Togglable from '../../components/UI/Togglable';
import {
  ErrorNotification,
  InfoNotification,
  SuccessNotification,
} from '../../components/Notifications';

const EventRequest = ({ user, event }: { user: User; event: Event }) => {
  const acceptPoint = async () => {
    try {
      const updatedEvent = await UserService.updateUserEventStatus(
        user,
        event.id,
        EventStatus.COMPLETED,
      );
      SuccessNotification(
        `${event.name} för ${user.firstName} ${user.lastName} har godkännts!`,
      );
    } catch (error) {
      console.error({
        error,
        message: 'acceptPoint function could not be completed',
      });
      ErrorNotification(
        `${event.name} för ${user.firstName} ${user.lastName} kunde inte godkännas!`,
      );
    }
  };
  const declinePoint = () => {
    try {
      UserService.updateUserEventStatus(user, event.id, EventStatus.CANCELLED);
      InfoNotification(
        `${event.name} för ${user.firstName} ${user.lastName} har förkastas`,
      );
    } catch (error) {
      console.error({
        error,
        message: 'declinePoint function could not be completed',
      });
      ErrorNotification(
        `${event.name} för ${user.firstName} ${user.lastName} kunde inte förkastas!`,
      );
    }
  };

  return (
    <Box>
      {event.name}
      <Button variant={'contained'} onClick={acceptPoint}>
        Godkänn
      </Button>
      <Button variant={'contained'} onClick={declinePoint}>
        Förkasta
      </Button>
    </Box>
  );
};

const UserRequests = ({ user, events }: { user: User; events: Event[] }) => {
  const userEvents = user.events.map((dv: DoneEvent) =>
    ensure(events.find((event: Event) => event.id === dv.eventID)),
  );
  const eventsWithRequests = userEvents.map((event: Event) =>
    event ? (
      <EventRequest
        key={`user${user.id}+event${event.id}`}
        user={user}
        event={event}
      />
    ) : (
      <></>
    ),
  );
  return (
    <Box>
      <Typography variant="h6">
        {user.firstName + ' ' + user.lastName}
      </Typography>
      <Box>
        <Togglable
          buttonLabelOpen={'Visa förfrågningar'}
          buttonLabelClose={'Stäng'}
        >
          {eventsWithRequests}
        </Togglable>
      </Box>
    </Box>
  );
};

const RequestPage = () => {
  const [users, setUsers] = useState<User[] | undefined>();
  const [events, setEvents] = useState<Event[] | undefined>();
  useEffect(() => {
    const getEvents = async () => {
      const response = await EventService.getAllEvents();
      setEvents(response);
    };
    const getUsers = async () => {
      const response = await UserService.getAllUsers();
      setUsers(response);
    };
    getEvents();
    getUsers();
  }, [users]);

  if (!users || !events) {
    return <React.Fragment></React.Fragment>;
  }

  const usersFilteredEvents = users.map((user: User) => {
    const filteredUser = {
      ...user,
      events: user.events.filter(
        (doneEvent: DoneEvent) => doneEvent.status === EventStatus.PENDING,
      ),
    };
    return filteredUser;
  });
  const usersWithRequests = usersFilteredEvents.filter(
    (user: User) => user.events.length > 0,
  );

  const userRequests = usersWithRequests.map((user: User) => {
    return <UserRequests key={user.id} user={user} events={events} />;
  });

  return (
    <Box>
      <Typography variant="h5">Ansökta underskrifter</Typography>
      {userRequests}
    </Box>
  );
};

export default RequestPage;
