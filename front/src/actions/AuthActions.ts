export type AuthActions = UserLogin;

interface UserLogin {
  type: 'USER_LOGIN';
  auth: boolean;
}

export const userLogin = (auth: boolean): UserLogin => {
  return {
    type: 'USER_LOGIN',
    auth,
  };
};
