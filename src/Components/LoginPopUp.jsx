import { useState } from "react";
import { loginUser } from "../config/firebase";

export default function LoginPopUp({ popUpState, setPopUp, toggleState }) {

  const [user, setUser] = useState({email: "", password: ""});

  async function login(event) {
    event.preventDefault();
    // console.log(user)
    await loginUser(user.email, user.password);
  }

  return popUpState ? (
    <div
      className="popUpContainerOuter"
      onClick={() => toggleState(popUpState, setPopUp)}
    >
      <form className="popUpForm" onClick={(event) => event.stopPropagation()}>
        <p>Log In</p>
        <br />
        <input
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value})}
        ></input>
        <br />
        <input
          placeholder="Password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        ></input>
        <br />
        <button type="submit" onClick={login}>
          Submit
        </button>
      </form>
    </div>
  ) : (
    ""
  );
}
