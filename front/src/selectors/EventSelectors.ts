import { createSelector } from 'reselect';
import { userCompletedEvents } from './AuthSelectors';
import _ from 'lodash';
import { EventState, Event, DoneEvent } from '../types';

export const allEvents = (state: any): EventState => state.events;

export const eventsInCategory = (categoryId: string) =>
  createSelector(allEvents, events => {
    return events.events.filter(
      (event: Event) => event.categoryId === Number(categoryId),
    );
  });

export const completedEventsInCategoryCastedToEvents = (categoryId: string) =>
  createSelector(
    eventsInCategory(categoryId),
    userCompletedEvents,
    (events, eventsCompletedByUser) => {
      return eventsCompletedByUser
        ?.filter((doneEvent: DoneEvent) => {
          return events
            .map((event: Event) => event.id)
            .includes(doneEvent.eventID);
        })
        .map((doneEvent: DoneEvent) =>
          events.find((event: Event) => doneEvent.eventID === event.id),
        )
        .filter(x => x !== undefined);
    },
  );

export const allEventsOrderedByStartTime = createSelector(allEvents, events =>
  _.orderBy(events.events, 'startTime', 'desc'),
);

export const allEventsOrderedByNameAsc = createSelector(allEvents, events =>
  _.orderBy(events.events, 'name', 'asc'),
);

export const eventsByCategoryId = (state: any, categoryId: string): Event[] =>
  state.events.filter((e: Event) => e.categoryId === Number(categoryId));
