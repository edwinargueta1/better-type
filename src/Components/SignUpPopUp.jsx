import { useState } from "react";
import { auth, createNewUser, database } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {  doc, getDoc } from "firebase/firestore";

export default function SignUpPopUp({ popUpState, setPopUp, toggleState }) {
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [signUpError, setSignUpIndicator] = useState("");
  const [newUser, setNewUser] = useState({
    username: "chub",
    email: "mail@mail.com",
    password: "cacaca",
    reEnterPassword: "cacaca",
  });

  async function validSignUp() {
    //username too long
    if(newUser.username.length > 16){
      setSignUpIndicator("Username must be 16 characters or less.")
      return false;
    }
    //Valid password
    if (newUser.password.length < 6) {
      setSignUpIndicator("Password must be 6 characters or longer.");
      return false;
    }
    //If both passwords don't match
    if (newUser.password !== newUser.reEnterPassword) {
      setSignUpIndicator("Passwords do not match.");
      return false;
    }
    //email needs too look like an email
    if (!validEmailRegex.test(newUser.email)) {
      setSignUpIndicator("Not a valid email format.");
      return false;
    }
    //Username exits
    const docRef = doc(database, "Users", newUser.username);
    const doesDocumentExist = await getDoc(docRef);
    if (doesDocumentExist.exists()) {
      setSignUpIndicator("Username already exists.");
      return false;
    }
    
    return true;
  }
  async function signUpSuccess() {
    try{
      console.log(newUser);
      await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      const userData = {
        userName: newUser.username,
        email: newUser.email,
        heightestWPM: 0,
        averageWPM: 0,
        lessons: 0,
        totalWords: 0,
        totalErrors: 0,
        totalTime: 0,
      };
      createNewUser("Users", userData);
      setSignUpIndicator(`User ${newUser.username} Created!`);
      setNewUser({
        username: "",
        email: "",
        password: "",
        reEnterPassword: "",
      });
    }catch(error){
      console.error(error);
      setSignUpIndicator("Email already in use.");
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (await validSignUp()) {
      console.log("valid")
      try {
        signUpSuccess();
      } catch (error) {
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
          onChange={(e) =>
            setNewUser({ ...newUser, reEnterPassword: e.target.value })
          }
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
