import * as React from "react";
import useReactRouter from "use-react-router";
import { UserContext, ISignUpForm } from "./UserContext";
import * as styles from "./Login.module.css";

export function SignupForm() {
  const { signUp } = React.useContext(UserContext);
  const { history } = useReactRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);
    const allData = (Object.fromEntries(
      data.entries()
    ) as unknown) as ISignUpForm;
    await signUp(allData);
    history.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input name="password" id="password" type="password" />
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input name="confirmPassword" id="confirmPassword" type="password" />
      <button type="submit" style={{ width: "100%" }}>
        Sign Up
      </button>
    </form>
  );
}
