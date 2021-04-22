import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { MainLayout } from "../MainLayout";
import { Login } from "../../pages/Login";
import { Home } from "../../pages/Home";
import { UserContext } from "../../pages/Login/UserContext";

export function Router() {
  const { userState, getUser } = React.useContext(UserContext);
  const id = userState.user && userState.user.id;

  React.useEffect(() => {
    getUser();
    return () => {};
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!userState.user && userState.loggingIn) {
    return null;
  }

  return (
    <BrowserRouter>
      {userState.user ? (
        <MainLayout>
          <Route
            path="/"
            render={() => (
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="*" render={() => <Redirect to="/" />} />
              </Switch>
            )}
          />
        </MainLayout>
      ) : (
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Login} />
          <Route path="*" render={() => <Redirect to="/login" />} />
        </Switch>
      )}
    </BrowserRouter>
  );
}
