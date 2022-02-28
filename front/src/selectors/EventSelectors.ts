import { createSelector } from 'reselect';
import _ from 'lodash';
import { EventState, Event } from '../types';

export const allEvents = (state: any): EventState => state.events;

export const eventsInCategory = (categoryId: string) =>
  createSelector(allEvents, events => {
    return events.events.filter(
      (event: Event) => event.categoryId === Number(categoryId),
    );
  });

export const allEventsOrderedByStartTime = createSelector(allEvents, events =>
  _.orderBy(events.events, 'startTime', 'desc'),
);

export const allEventsOrderedByNameAsc = createSelector(allEvents, events =>
  _.orderBy(events.events, 'name', 'asc'),
);

export const eventsByCategoryId = (state: any, categoryId: string): Event[] =>
  state.events.filter((e: Event) => e.categoryId === Number(categoryId));
