import { EventActions } from '../actions';
import { EventState, Event } from '../types';

const INITIAL_STATE: EventState = {
  isFetched: false,
  events: [],
};

const eventReducer = (state = INITIAL_STATE, action: EventActions) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return { isFecthed: action.isFetched, events: action.events };
    case 'ADD_EVENT': {
      return {
        ...state,
        events: [...state.events, action.event],
      };
    }
    case 'EDIT_EVENT': {
      return {
        ...state,
        events: [
          ...state.events.filter(
            (event: Event) => event.id !== action.event.id,
          ),
          action.event,
        ],
      };
    }
    default:
      return state;
  }
};

export default eventReducer;
