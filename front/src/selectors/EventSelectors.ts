import { createSelector } from 'reselect';
import _ from 'lodash';
import * as AuthSelector from './AuthSelectors';
import { EventState, Event, DoneEvent } from '../types';

export const allEvents = (state: any): EventState => state.events;

export const eventsInCategory = (categoryId: string) =>
  createSelector(allEvents, events => {
    return events.events.filter(
      (event: Event) => event.categoryId === Number(categoryId),
    );
  });

export const completedEventsInCategory = (categoryId: string) =>
  createSelector(
    eventsInCategory(categoryId),
    AuthSelector.userCompletedEvents,
    (events, userCompletedEvents) => {
      if (!userCompletedEvents) return [];
      const completedEventsInCategory = userCompletedEvents.filter(
        (doneEvent: DoneEvent) => {
          return events
            .map((event: Event) => event.id)
            .includes(doneEvent.eventID);
        },
      );

      return completedEventsInCategory
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
