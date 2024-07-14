import { useState, useEffect } from "react";
import { loginUserWithEmail, loginWithGoogle } from "../config/firebase";
import { toggleState } from "../Functions/localDataManagement";

export default function LoginPopUp({ popUpState, setPopUp }) {

  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [loginIndicator, setLoginIndicator] = useState('');

  function clearTempData(){
    setUser({
      email: "",
      password: ""
    });
    setLoginIndicator("");
  }

  //Reset input values
  useEffect(()=>{
    clearTempData();
  },[popUpState]);

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
        <button type="submit" onClick={(e)=>{
          clearTempData();
          loginUserWithEmail(e, user.email, user.password, setLoginIndicator);
          if(loginIndicator.length < 1){
            clearTempData();
            toggleState(popUpState, setPopUp)
          }
          }}>
          Submit
        </button>
        <p className="verticalSpacer">__________________</p>
        <button className="googleSignInButton" onClick={async(event) => {
          loginWithGoogle(event, setLoginIndicator, setPopUp);
          clearTempData();
          }}>
          <svg height="19" viewBox="0 0 24 24" width="24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          <path d="M1 1h22v22H1z" fill="none"/>
          </svg>Sign in with Google</button>
        <p>{loginIndicator}</p>
      </form>
    </div>
  ) : (
    ""
  );
}
