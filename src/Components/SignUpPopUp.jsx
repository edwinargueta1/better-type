import { useState } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpPopUp({ popUpState, setPopUp, toggleState }) {

  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [signUpError, setSignUpError] = useState("");
  const [newUser, setNewUser] = useState({ username : "", email: "", password: "", reEnterPassword: ""});

  function validSignUp(){
    //Valid password
    if(newUser.password.length < 8){
      setSignUpError("Password must be 8 characters or longer.")
      return false;
    }
    //If both passwords don't match
    if(newUser.password !== newUser.reEnterPassword){
      setSignUpError("Passwords do not match.")
      return false;
    }
    //email needs too look like an email
    if(!validEmailRegex.test(newUser.email)){
      setSignUpError("Not a valid email format.")
      return false;
    }
    return true;
  }

  async function submit(event) {
    event.preventDefault();
    if(validSignUp()){
      try{
             await createUserWithEmailAndPassword(
               auth,
               newUser.email,
               newUser.password
             );
      }catch(error){
        console.error(error);
      }
    }
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
        <p>{signUpError}</p>
      </form>
    </div>
  ) : (
    ""
  );
}
