import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@material-ui/core';
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
  const events: Event[] = useSelector(
    EventSelector.allEventsOrderedByStartTime,
  );
  const userInfo: User | undefined = useSelector(AuthSelector.auth).userInfo;
  const [selectedCardId, setSelectedCardId] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    events.length > 0 && setSelectedCardId(events[0].id);
  }, [events]);

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
  const completedPointsInCategory: number =
    completedEventsInCategoryCastedToEvents
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
    <Box mt={theme.spacing(4)}>
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

/*
const ColorBox = styled.div<{
  align?: 'left' | 'right';
}>`
  text-align: ${p => p.align || 'left'};
  z-index: 1;
`;

const Wrapper = styled.div<{
  width: number;
}>`
  position: relative;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
  gap: ${p => p.theme.spacing.small};
  width: 100%;
  min-height: 60px;
  height: 100%;
  align-self: stretch;
  padding: ${p => p.theme.spacing.default};
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  background-color: ${p => p.theme.colors.grey};
  transition: background-color 0.5s, opacity 0.1s;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${p => p.width}%;
    border-radius: ${p => (p.width === 100 ? '5px' : '5px 0 0 5px')};
    background-color: ${p => p.theme.colors.seaweed};
  }
`;
*/
