import { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPopUp({ popUpState, setPopUp, toggleState }) {

  const [user, setUser] = useState({
    email: "mail@mail.com",
    password: "cacaca",
  });
  const [loginIndicator, setLoginIndicator] = useState('');

  async function login(event) {
    event.preventDefault();
    await loginUser(user.email, user.password);
  }
  function updateLoginIndicator(error){
    setLoginIndicator(error.message);
  }
  async function loginUser(email, password) {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.message === "Firebase: Error (auth/user-not-found)."){
        return setLoginIndicator('User Not Found.')
      }
        setLoginIndicator(error.message);
    }
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
        <p>{loginIndicator}</p>
      </form>
    </div>
  ) : (
    ""
  );
}
