import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import TypeGame from "./Pages/TypeGame.jsx";
import ProfileCard from "./Components/ProfileCard.jsx";
import LoginPopUp from "./Components/LoginPopUp.jsx";
import SignUpPopUp from "./Components/SignUpPopUp.jsx";
import NavBar from "./Components/NavBar.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase.js";
import { clearStoredLessons, toggleState } from "./Functions/localDataManagement.js";
import ErrorPage from "./Pages/ErrorPage.jsx";
import LeaderboardPage from "./Pages/LeaderboardPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import "./App.css"


function App() {
  const [dictionary, setDictionary] = useState([]); 
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  
  const [user, setUser] = useState(null);
  const [phraseHistoryData, setPhraseHistoryData] = useState([]);

  const [topUsers, setTopUsers] = useState([[],[],[]]);
  const loadedTopUsers = useRef({
    10: false,
    20: false,
    30: false
  })

  const [stats, setStats] = useState(null);
  const isProfileStatsLoaded = useRef(false);

  function clearState(){
    console.log("cleared state")
    setTopUsers([[],[],[]]);
    loadedTopUsers.current = {
      10: false,
      20: false,
      30: false
    }
    setStats(null);
    isProfileStatsLoaded.current = false;
    clearStoredLessons();
    setPhraseHistoryData([]);
  }

  //User Management
  useEffect(()=>{
    const stateOfAuth = onAuthStateChanged(auth, (user) =>{
      if(user){
        setUser(user);
      }else{
        setUser(null);
        clearState();
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
      />
      <SignUpPopUp
        popUpState={isSignUpActive}
        setPopUp={setIsSignUpActive}
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
      <NavBar />
      <div className="bodyContent">
          <Routes>
            <Route path="/" element={<TypeGame user={user} dictionary={dictionary} setTopUsers={setTopUsers} loadedTopUsers={loadedTopUsers} phraseHistoryData={phraseHistoryData} setPhraseHistoryData={setPhraseHistoryData} isProfileStatsLoaded={isProfileStatsLoaded} setStats={setStats}/>} />
            <Route path="/Profile" element={<ProfilePage user={user} stats={stats} setStats={setStats}  isProfileStatsLoaded={isProfileStatsLoaded}/>} />
            <Route path="/Leaderboard" element={<LeaderboardPage user={user} setStats={setStats} topUsers={topUsers} setTopUsers={setTopUsers} loadedTopUsers={loadedTopUsers}/>} />
            <Route path="*" element={<ErrorPage error={"404 Page not Found."}/>} />
          </Routes>
      </div>
      <div className="footer">

      </div>
    </div>

  );
}

export default App;
