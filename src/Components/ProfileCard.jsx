import React from "react";
import { auth, logout } from "../config/firebase.js"

export default function ProfileCard({
  user,
  isLoginActive,
  setIsLoginActive,
  isSignUpActive,
  setIsSignUpActive,
  toggleState,
}) {

  return (
    <div className="menuBackground">
      <div className="profileContainer">
        <p className="accountName">{user ? user.displayName : "Guest"}</p>
        {user ? (
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
