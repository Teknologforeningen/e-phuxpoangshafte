export type AuthActions = Login;

interface Login {
  type: 'LOGIN';
  auth: boolean;
}

export const login = (auth: boolean): Login => {
  return {
    type: 'LOGIN',
    auth,
  };
};
