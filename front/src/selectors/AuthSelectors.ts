import { createSelector } from 'reselect';
import { AuthState, DoneEvent, EventStatus } from '../types';

export const auth = (state: any): AuthState => state.auth;

export const userCompletedEvents = createSelector(auth, auth => {
  return auth.userInfo?.events.filter(
    (event: DoneEvent) => event.status === EventStatus.COMPLETED,
  );
});

export const token = (state: any): string => {
  if (state.auth.userIsAutharized) {
    return state.auth.userInfo.token;
  }
  return '';
};
