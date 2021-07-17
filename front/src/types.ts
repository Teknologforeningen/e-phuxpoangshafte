export interface AuthState {
  userIsAutharized: boolean;
  userInfo?: authDetails
}

export interface authDetails {
  token: string;
  userMail: string;
  id: number;
}
