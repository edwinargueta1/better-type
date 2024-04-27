import React, { useState } from "react";
export default function Profile({
  userName,
  isLoginActive,
  setIsLoginActive,
  isSignUpActive,
  setIsSignUpActive,
  toggleState,
}) {
  return (
    <div className="menuBackground">
      <div className="profileContainer">
        <p className="accountName">{userName}</p>
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
      </div>
    </div>
  );
}
