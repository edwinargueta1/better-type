import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TypeGame from "./Components/TypeGame.jsx";
import ProfileCard from "./Components/ProfileCard.jsx";
import LoginPopUp from "./Components/LoginPopUp.jsx";
import SignUpPopUp from "./Components/SignUpPopUp.jsx";
import NavBar from "./Components/NavBar.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase.js";
import ErrorPage from "./Components/ErrorPage.jsx";
import LeaderboardPage from "./Components/LeaderboardPage.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";


function App() {
  const [dictionary, setDictionary] = useState([]);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  
  const [user, setUser] = useState(null);

  function toggleState(variable, functionVariable){
    functionVariable(!variable)
  }

  //User Management
  useEffect(()=>{
    const stateOfAuth = onAuthStateChanged(auth, (user) =>{
      console.log(user)
      console.log(new Date(user.metadata.creationTime).toLocaleDateString());
      if(user){
        setUser(user);
      }else{
        setUser(null);
      }
    });

    return() => stateOfAuth();
  }, [])

  useEffect(() => {
    async function buildDictionary() {
      //Text Stores all the words in dictionary into an array
      let text = await fetch("/dictionary.txt")
        .then((res) => {
          return res.text();
        })
        .then((words) => {
          return words.split("\r\n");
        })
        .catch((err) => {
          return `File  Not Found. ${err}`;
        });
      setDictionary(text);
    }
    buildDictionary();
  }, []);


  return (
    
    <div className="App">
      
      <LoginPopUp
        popUpState={isLoginActive}
        setPopUp={setIsLoginActive}
        toggleState={toggleState}
      />
      <SignUpPopUp
        popUpState={isSignUpActive}
        setPopUp={setIsSignUpActive}
        toggleState={toggleState}
      />
      <div className="title">
        <div className="spacer"></div>
        <h1 className="titleName">Better Type</h1>
        <ProfileCard
          user={user}
          isLoginActive={isLoginActive}
          setIsLoginActive={setIsLoginActive}
          isSignUpActive={isSignUpActive}
          setIsSignUpActive={setIsSignUpActive}
          toggleState={toggleState}
        />
      </div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<TypeGame user={user} dictionary={dictionary}/>}/>
        <Route path="/Profile" element={<ProfilePage user={user}/>}/>
        <Route path="/Leaderboard" element={<LeaderboardPage/>}/>
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
