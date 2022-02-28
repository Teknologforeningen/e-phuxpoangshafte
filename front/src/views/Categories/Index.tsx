import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as CategorySelector from '../../selectors/CategorySelectors';
import * as EventSelector from '../../selectors/EventSelectors';
import * as AuthSelector from '../../selectors/AuthSelectors';
import { User, Category, DoneEvent, Event, EventStatus } from '../../types';
import EventCard from './components/EventCard';
import { orderBy } from 'lodash';

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
  const eventsInCategory = orderBy(
    useSelector(EventSelector.eventsInCategory(categoryID)),
    'startTime',
    'desc',
  );
  const completedEventsInCategory = orderBy(
    useSelector(EventSelector.completedEventsInCategory(categoryID)),
    'startTime',
    'desc',
  );
  const userInfo: User | undefined = useSelector(AuthSelector.auth).userInfo;
  const [selectedCardId, setSelectedCardId] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    const firstNoNCompletedEvent = eventsInCategory.find(
      event =>
        !completedEventsInCategory.find(
          completedEvent => completedEvent?.id === event.id,
        ),
    );
    firstNoNCompletedEvent && setSelectedCardId(firstNoNCompletedEvent.id);
  }, [completedEventsInCategory, eventsInCategory]);

  if (!category || !events || !userInfo) {
    return <React.Fragment></React.Fragment>;
  }

  const completedPointsInCategory: number = completedEventsInCategory
    .map((event: Event | undefined) => (event ? event.points : 0))
    .reduce(
      (acc: number, cur: number | undefined) => (cur ? acc + cur : acc),
      0,
    );
  const renderEvent = (event: Event) => {
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
  };

  return (
    <Box mt={theme.spacing(4)}>
      <h2>{category.name}</h2>
      <i>{category.description}</i>
      <br />
      {category.minPoints
        ? 'Poäng: ' + completedPointsInCategory + '/' + category.minPoints
        : ''}
      <br />
      {eventsInCategory.map((event: Event) =>
        completedEventsInCategory.find(
          completedEvent => completedEvent?.id === event.id,
        )
          ? ''
          : renderEvent(event),
      )}
      {completedEventsInCategory.map((event: Event | undefined) =>
        event === undefined ? '' : renderEvent(event),
      )}
    </Box>
  );
};

export default CategoryPage;
