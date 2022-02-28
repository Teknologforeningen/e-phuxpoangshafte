import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as CategorySelector from '../../selectors/CategorySelectors';
import * as EventSelector from '../../selectors/EventSelectors';
import { auth } from '../../selectors/AuthSelectors';
import { User, Category, DoneEvent, Event } from '../../types';
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

  const eventsInCategory = useSelector(
    EventSelector.eventsInCategory(categoryID),
  );

  const completedEventsInCategoryCastedToEvents = useSelector(
    EventSelector.completedEventsInCategoryCastedToEvents(categoryID),
  );

  const firstEventNotCompleted = eventsInCategory.find(
    (event: Event) =>
      !completedEventsInCategoryCastedToEvents?.find(
        completedEvent => completedEvent?.id === event.id,
      ),
  );

  const userInfo: User | undefined = useSelector(auth).userInfo;

  const theme = useTheme();

  const [selectedCardId, setSelectedCardId] = useState<number>(0);

  useEffect(() => {
    firstEventNotCompleted
      ? setSelectedCardId(firstEventNotCompleted.id)
      : events.length > 0
      ? setSelectedCardId(events[0].id)
      : setSelectedCardId(0);
  }, [firstEventNotCompleted, events]);

  if (!userInfo || !category || !events) {
    return <React.Fragment></React.Fragment>;
  }

  const completedPointsInCategory: number =
    completedEventsInCategoryCastedToEvents
      ?.map((event: Event | undefined) => (event ? event.points : 0))
      .reduce(
        (acc: number, cur: number | undefined) => (cur ? acc + cur : acc),
        0,
      ) ?? 0;

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
        completedEventsInCategoryCastedToEvents?.find(
          completedEvent => completedEvent?.id === event.id,
        )
          ? ''
          : renderEvent(event),
      )}
      {completedEventsInCategoryCastedToEvents?.map(
        (event: Event | undefined) =>
          event === undefined ? '' : renderEvent(event),
      )}
    </Box>
  );
};

export default CategoryPage;
