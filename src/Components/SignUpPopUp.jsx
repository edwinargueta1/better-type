import { useState } from "react";
import { signUpWithGoogle, signUpWithEmail } from "../config/firebase";
import { toggleState } from "../Functions/localDataManagement";

export default function SignUpPopUp({ popUpState, setPopUp }) {
  const [signUpError, setSignUpIndicator] = useState("");
  const [newUser, setNewUser] = useState({
    displayName: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });
  const [googleUserName, setGoogleUserName] = useState("");

  function clearTempData(){
    setNewUser({
      displayName: "",
      email: "",
      password: "",
      reEnterPassword: "",
    });
    setSignUpIndicator("");
  }
  

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
          value={newUser.displayName}
          onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
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
          onChange={(e) =>
            setNewUser({ ...newUser, reEnterPassword: e.target.value })
          }
        ></input>
        <br />
        <button type="submit" onClick={async (event) => {
          console.log("From button: ", newUser)
          await signUpWithEmail(event, newUser, setSignUpIndicator);
          clearTempData();
        }}>
          Submit
        </button>
        <br />
        <p className="verticalSpacer">___________________</p>
        <br />
        <input onChange={(e)=> setGoogleUserName(e.target.value)}
        value={googleUserName}
        placeholder="Username"
        ></input>
        <button className="googleSignInButton" onClick={(event)=>{
          signUpWithGoogle(event, googleUserName, setSignUpIndicator);
          clearTempData();
        }}>
          <svg height="19" viewBox="0 0 24 24" width="24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign up with Google
        </button>
        <p>{signUpError}</p>
      </form>
    </div>
  ) : (
    ""
  );
}
