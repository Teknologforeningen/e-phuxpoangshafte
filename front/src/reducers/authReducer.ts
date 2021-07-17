import { AuthActions } from '../actions';
import { AuthState } from '../types';

const INITIAL_STATE: AuthState = {
  userIsAutharized: false,
};

const authReducer = (state = INITIAL_STATE, action: AuthActions) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, userIsAutharized: action.userIsAutharized, userInfo: {...action.userInfo}};
    default:
      return state;
  }
};

export default authReducer;
