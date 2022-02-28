import { ServiActions } from '../actions';
import { ServiState, Servi } from '../types';

const INITIAL_STATE: ServiState = {
  isFetched: false,
  servis: [],
};

const serviReducer = (state = INITIAL_STATE, action: ServiActions) => {
  switch (action.type) {
    case 'INIT_SERVIS':
      return { isFecthed: action.isFetched, servis: action.servis };
    case 'ADD_SERVI': {
      return {
        ...state,
        servis: [...state.servis, action.servi],
      };
    }
    case 'EDIT_SERVI': {
      return {
        ...state,
        events: [
          ...state.servis.filter(
            (servi: Servi) => servi.id !== action.servi.id,
          ),
          action.servi,
        ],
      };
    }
    default:
      return state;
  }
};

export default serviReducer;
