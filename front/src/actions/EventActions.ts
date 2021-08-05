import { Event } from "../types"

export type EventActions = InitEvents | AddEvent;

interface InitEvents {
  type: 'INIT_EVENTS';
  isFetched: boolean;
  events: Event[]
}

interface AddEvent {
  type: 'ADD_EVENT';
  event: Event;
}

export const initEvents = (events: Event[]): InitEvents => {
  return {
    type: 'INIT_EVENTS',
    isFetched: true,
    events,
  };
};

export const addEvent = (event: Event): AddEvent => {
  return ({
    type: 'ADD_EVENT',
    event
  })
}
