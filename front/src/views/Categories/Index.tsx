import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as CategorySelector from '../../selectors/CategorySelectors';
import * as EventSelector from '../../selectors/EventSelectors';
import * as AuthSelector from '../../selectors/AuthSelectors';
import { User, Category, DoneEvent, Event, EventStatus } from '../../types';
import EventCard from './components/EventCard';

interface RouteType {
  categoryId: string;
}

const CategoryPage = () => {
  const match = useRouteMatch('/kategori/:categoryId');
  const categoryID = match ? (match.params as RouteType).categoryId : '1';
  const category: Category = useSelector(state =>
    CategorySelector.categoryById(state, categoryID),
  );
  const events: Event[] = useSelector(EventSelector.allEvents).events;
  const userInfo: User | undefined = useSelector(AuthSelector.auth).userInfo;
  const [selectedCardId, setSelectedCardId] = useState<number>(1);

  if (!category || !events || !userInfo) {
    return <React.Fragment></React.Fragment>;
  }

  const eventsInCategory = events.filter(
    (event: Event) => event.categoryId === Number(categoryID),
  );
  const userCompletedEvents = userInfo.events.filter(
    (event: DoneEvent) => event.status === EventStatus.COMPLETED,
  );

  const completedEventsInCategory = userCompletedEvents.filter(
    (doneEvent: DoneEvent) => {
      return eventsInCategory
        .map((event: Event) => event.id)
        .includes(doneEvent.eventID);
    },
  );

  const completedEventsInCategoryCastedToEvents = completedEventsInCategory.map(
    (doneEvent: DoneEvent) =>
      eventsInCategory.find((event: Event) => doneEvent.eventID === event.id),
  );
  const completedPointsInCategory: number = completedEventsInCategoryCastedToEvents
    .map((event: Event | undefined) => (event ? event.points : 0))
    .reduce(
      (acc: number, cur: number | undefined) => (cur ? acc + cur : acc),
      0,
    );

  const ListOfEvents = eventsInCategory.map((event: Event) => {
    const complitionStatus = userInfo.events.find(
      (doneEvent: DoneEvent) => doneEvent.eventID === event.id,
    )?.status;
    return (
      <EventCard
        key={event.id}
        event={event}
        complitionStatus={complitionStatus}
        selectCardId={selectedCardId}
        setSelectCardId={setSelectedCardId}
      />
    );
  });
  return (
    <Box>
      <h2>{category.name}</h2>
      <i>{category.description}</i>
      <br />
      {category.minPoints
        ? 'Poäng: ' + completedPointsInCategory + '/' + category.minPoints
        : ''}
      <br />
      {ListOfEvents}
    </Box>
  );
};

export default CategoryPage;
