import { AuthActions } from '../actions';
import { AuthState } from '../types';

const INITIAL_STATE: AuthState = {
  userIsAutharized: false,
};

const authReducer = (state = INITIAL_STATE, action: AuthActions) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        userIsAutharized: action.userIsAutharized,
        userInfo: { ...action.userInfo },
      };
    case 'ADD_USER_EVENT': {
      if (!state.userInfo) {
        return state;
      }
      const newEventState = [...state.userInfo.events, action.event];
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          events: newEventState,
        },
      };
    }
    default:
      return state;
  }
};

export default authReducer;
