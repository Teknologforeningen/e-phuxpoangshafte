import * as React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../pages/Login/UserContext";

export function Sidebar() {
  const { userState, logOut } = React.useContext(UserContext);
  if (!userState.user) {
    return null;
  }
  if (!userState.user.emails) {
    return <p>no email</p>;
  }
  const email = userState.user.emails[0].address;
  return (
    <nav>
      <ul style={{ marginRight: 40 }}>
        <section>
          <p>Email: {email}</p>
        </section>
        <button onClick={logOut}>Log Out</button>
        <Link to="/">Home</Link>
        <Link to="/settings">Settings</Link>
      </ul>
    </nav>
  );
}
