import { AuthActions } from '../actions';
import { AuthState } from '../types';

const INITIAL_STATE: AuthState = {
  auth: false,
};

const authReducer = (state = INITIAL_STATE, action: AuthActions) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, auth: action.auth };
    default:
      return state;
  }
};

export default authReducer;
