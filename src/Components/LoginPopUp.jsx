import { useState } from "react";

export default function LoginPopUp({ popUpState, setPopUp, toggleState }) {

  const [user, setUser] = useState({username: "", password: ""});

  function submit(event) {
    event.preventDefault();
    console.log(user)
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
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value})}
        ></input>
        <br />
        <input
          placeholder="Password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        ></input>
        <br />
        <button type="submit" onClick={submit}>
          Submit
        </button>
      </form>
    </div>
  ) : (
    ""
  );
}
