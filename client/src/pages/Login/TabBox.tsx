import * as React from "react";
import { NavLink } from "react-router-dom";
import * as styles from "./Login.module.css";

export enum Tabs {
  login = "/login",
  signup = "/signup"
}

interface IProps {
  children: React.ReactNode;
}

export function TabBox({ children }: IProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 500 }}>
      <div className={styles.tabsContainer}>
        <NavLink to={Tabs.login} replace className={styles.tabOuter}>
          Login
        </NavLink>
        <NavLink to={Tabs.signup} replace className={styles.tabOuter}>
          Signup
        </NavLink>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
