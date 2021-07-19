import { authDetails } from "../types"

export type AuthActions = UserLogin;

interface UserLogin {
  type: 'USER_LOGIN';
  userIsAutharized: boolean;
  userInfo: authDetails; 
}

export const userLogin = (userInfo: authDetails): UserLogin => {
  return {
    type: 'USER_LOGIN',
    userIsAutharized: true,
    userInfo
  };
};
