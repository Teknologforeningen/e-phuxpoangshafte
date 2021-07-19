import { EventActions } from '../actions';
import { EventState } from '../types';

const INITIAL_STATE: EventState = {
  isFetched: false,
  events: []
};

const eventReducer = (state = INITIAL_STATE, action: EventActions) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return {isFecthed: action.isFetched, events: action.events};
    default:
      return state;
  }
};

export default eventReducer;
