import { Event } from '../types';

export type EventActions = InitEvents | AddEvent | EditEvent;

interface InitEvents {
  type: 'INIT_EVENTS';
  isFetched: boolean;
  events: Event[];
}

export const initEvents = (events: Event[]): InitEvents => {
  return {
    type: 'INIT_EVENTS',
    isFetched: true,
    events,
  };
};

interface AddEvent {
  type: 'ADD_EVENT';
  event: Event;
}

export const addEvent = (event: Event): AddEvent => {
  return {
    type: 'ADD_EVENT',
    event,
  };
};

interface EditEvent {
  type: 'EDIT_EVENT';
  event: Event;
}

export const editEvent = (event: Event): EditEvent => {
  return {
    type: 'EDIT_EVENT',
    event,
  };
};
