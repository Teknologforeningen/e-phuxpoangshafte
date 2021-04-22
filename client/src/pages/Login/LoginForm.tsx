import React from "react";
import useReactRouter from "use-react-router";
import { UserContext } from "./UserContext";
import * as styles from "./Login.module.css";

export function LoginForm() {
  const { logIn } = React.useContext(UserContext);
  const { history } = useReactRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const username = data.get("username") as string;
    const password = data.get("password") as string;
    await logIn(username, password);
    history.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="Email">Email</label>
      <input name="username" id="username" required />
      <label htmlFor="password">Password</label>
      <input name="password" id="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
