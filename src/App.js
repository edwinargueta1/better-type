import "./App.css";
import React, { useState, useEffect } from "react";
import TypeGame from "./Components/TypeGame.jsx";
import Profile from "./Components/Profile.jsx";
import LoginPopUp from "./Components/LoginPopUp.jsx";
import SignUpPopUp from "./Components/SignUpPopUp.jsx";

function App() {
  const [dictionary, setDictionary] = useState([]);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  
  const [userName, setUserName] = useState('Guest');

  function toggleState(variable, functionVariable){
    functionVariable(!variable)
  }

  useEffect(() => {
    async function buildDictionary() {
      //Text Stores all the words in dictionary into an array
      let text = await fetch("/dictionary.txt")
        .then((res) => {
          return res.text();
        })
        .then((stuff) => {
          return stuff.split("\r\n");
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
          <Profile
            userName={userName}
            isLoginActive={isLoginActive} 
            setIsLoginActive={setIsLoginActive} 
            isSignUpActive={isSignUpActive}
            setIsSignUpActive={setIsSignUpActive}
            toggleState={toggleState}
          />
        </div>
        <TypeGame dictionary={dictionary} />
    </div>
  );
}

export default App;
