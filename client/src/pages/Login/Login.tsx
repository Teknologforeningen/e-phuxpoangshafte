import * as React from "react";
import { Route, Switch } from "react-router-dom";
import * as styles from "./Login.module.css";
import { LoginForm } from "./LoginForm";
import { TabBox } from "./TabBox";
import { SignupForm } from "./SignupForm";

export function Login() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <TabBox>
          <Switch>
            <Route path="/login" exact>
              <LoginForm />
            </Route>
            <Route path="/signup" exact>
              <SignupForm />
            </Route>
          </Switch>
        </TabBox>
      </div>
    </div>
  );
}
