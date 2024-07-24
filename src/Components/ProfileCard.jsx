import React, { useState, useEffect } from "react";
import { auth, logout } from "../config/firebase.js"

export default function ProfileCard({
  displayName,
  stats,
  isLoginActive,
  setIsLoginActive,
  isSignUpActive,
  setIsSignUpActive,
  toggleState,
}) {
  const [dName, setDName] = useState(displayName);

  useEffect(() => {
    setDName(displayName);
  }, [displayName, stats])

  return (
    <div className="menuBackground">
      <div className="profileContainer">
        <p className="accountName">{dName ? dName : "Guest"}</p>
        {dName ? (
          <div className="signInLogInWrapper">
            <button className="loginButton" onClick={() => logout(auth)}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="signInLogInWrapper">
            <button
              className="loginButton"
              onClick={() => toggleState(isLoginActive, setIsLoginActive)}
            >
              Log in
            </button>
            <button
              className="signUpButton"
              onClick={() => toggleState(isSignUpActive, setIsSignUpActive)}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
