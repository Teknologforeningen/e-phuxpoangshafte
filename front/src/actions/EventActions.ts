import { Event } from "../types"

export type EventActions = InitEvents;

interface InitEvents {
  type: 'INIT_EVENTS';
  isFetched: boolean;
  events: Event[]
}

export const initEvents = (events: Event[]): InitEvents => {
  return {
    type: 'INIT_EVENTS',
    isFetched: true,
    events,
  };
};
