import { useState } from "react";

export default function SignUpPopUp({ popUpState, setPopUp, toggleState }) {

  const [newUser, setNewUser] = useState({ username : "", email: "", password: "", reEnterPassword: ""});

  function submit(event) {
    event.preventDefault();
    console.log(newUser);
  }
  function validSignUp() {}
  return popUpState ? (
    <div
      className="popUpContainerOuter"
      onClick={() => toggleState(popUpState, setPopUp)}
    >
      <form className="popUpForm" onClick={(event) => event.stopPropagation()}>
        <p>Sign Up</p>
        <br />
        <input
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        ></input>
        <br />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        ></input>
        <br />
        <input
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        ></input>
        <br />
        <input
          placeholder="Re-enter Password"
          type="password"
          value={newUser.reEnterPassword}
          onChange={(e) => setNewUser({ ...newUser, reEnterPassword: e.target.value })}
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
