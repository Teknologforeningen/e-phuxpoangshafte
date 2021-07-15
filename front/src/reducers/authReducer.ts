import authService from '../services/auth';
import { AuthActions } from '../actions';
import { AuthState } from '../types';
import { localStorageSetter } from '../utils.ts/localStorage';

export const loginUser = (username: string, password: string) => {
  return async (dispatch: any) => {
    const loggedInUser = await authService.login({ username, password });
    localStorageSetter('auth', JSON.stringify(loggedInUser));
    dispatch({
      type: 'LOGIN',
      data: loggedInUser,
    });
    return loggedInUser;
  };
};

const INITIAL_STATE: AuthState = {
  auth: false,
};

const authReducer = (state = INITIAL_STATE, action: AuthActions) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, auth: action.auth };
    default:
      return state;
  }
};

export default authReducer;
