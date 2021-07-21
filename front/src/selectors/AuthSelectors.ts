import { AuthState } from '../types';

export const auth = (state: any): AuthState => state.auth;

export const token = (state: any): string => {
  if(state.auth.userIsAutharized){
    return state.auth.userInfo.token
  }
  return ''
}