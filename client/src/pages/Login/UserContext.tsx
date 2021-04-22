import * as React from "react";
import { User } from "../../generated/graphql";
import { accountsGraphQL, accountsPassword } from "../../utils/apollo";

interface UserState {
  user: User | null;
  loggingIn: boolean;
}

export interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserContext {
  userState: UserState;
  setUserState: (userState: UserState) => void;
  getUser: () => void;
  signUp: (args: ISignUpForm) => void;
  logIn: (email: string, password: string) => void;
  logOut: () => void;
}

const initialState = { user: null, loggingIn: true };

export const UserContext = React.createContext<UserContext>({
  userState: initialState,
  setUserState: () => {},
  getUser: () => {},
  signUp: () => {},
  logIn: () => {},
  logOut: () => {}
});

export const UserProvider: React.FC<{}> = props => {
  const [userState, setUserState] = React.useState<UserState>(initialState);

  async function getUser() {
    let user: User | null = null;

    try {
      user = ((await accountsGraphQL.getUser()) as unknown) as User;
    } catch (error) {
      console.error("There was an error logging in.", error);
    } finally {
      setUserState({
        user: user && { ...user, _id: user.id },
        loggingIn: false
      });
    }
  }

  const logIn = async (email: string, password: string) => {
    await accountsPassword.login({ password, user: { email } });
    await getUser();
  };

  const signUp = async (args: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const { email, password } = args;
    await accountsPassword.createUser({
      password,
      email
    });
    await logIn(email, password);
  };

  const logOut = async () => {
    await accountsGraphQL.logout();
    setUserState({ user: null, loggingIn: false });
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserState,
        getUser,
        signUp,
        logIn,
        logOut
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
