import { AuthActions } from '../actions';
import { AuthState } from '../types';

const INITIAL_STATE: AuthState = {
  userIsAutharized: null,
};

const userReducer = (state = INITIAL_STATE, action: AuthActions) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        userIsAutharized: action.userIsAutharized,
        userInfo: { ...action.userInfo },
      };
    case 'CHANGE_AUTHARIZED_STATUS': {
      return{ 
        ...state,
        userIsAutharized: action.status
      }
    }
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
    case 'USER_LOGOUT': {
      return {userIsAutharized: false};
    }
    default:
      return state;
  }
};

export default userReducer;
