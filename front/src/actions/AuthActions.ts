import { DoneEvent, User } from "../types"

export type AuthActions = UserLogin | AddUserEvent;

interface UserLogin {
  type: 'USER_LOGIN';
  userIsAutharized: boolean;
  userInfo: User; 
}

interface AddUserEvent {
  type: 'ADD_USER_EVENT'
  event: DoneEvent
}

export const userLogin = (userInfo: User): UserLogin => {
  return {
    type: 'USER_LOGIN',
    userIsAutharized: true,
    userInfo
  };
};

export const addUserEvent = (event: DoneEvent): AddUserEvent => {
  return{
    type: 'ADD_USER_EVENT',
    event
  }
}