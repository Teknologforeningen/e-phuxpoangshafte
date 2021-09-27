import { DoneEvent, User } from '../types';

export type AuthActions =
  | UserLogin
  | AddUserEvent
  | UserLogout
  | ChangeAutherizedStatus;

interface UserLogin {
  type: 'USER_LOGIN';
  userIsAutharized: boolean;
  userInfo: User;
}

export const userLogin = (userInfo: User): UserLogin => {
  return {
    type: 'USER_LOGIN',
    userIsAutharized: true,
    userInfo,
  };
};

interface AddUserEvent {
  type: 'ADD_USER_EVENT';
  event: DoneEvent;
}

export const addUserEvent = (event: DoneEvent): AddUserEvent => {
  return {
    type: 'ADD_USER_EVENT',
    event,
  };
};
interface UserLogout {
  type: 'USER_LOGOUT';
}

export const userLogout = (): UserLogout => {
  return {
    type: 'USER_LOGOUT',
  };
};

interface ChangeAutherizedStatus {
  type: 'CHANGE_AUTHARIZED_STATUS';
  status: boolean;
}

export const changeAutharizedStatus = (
  status: boolean,
): ChangeAutherizedStatus => {
  return {
    type: 'CHANGE_AUTHARIZED_STATUS',
    status,
  };
};
