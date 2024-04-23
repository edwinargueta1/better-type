import "./App.css";
import React, { useState, useEffect } from "react";
import TypeGame from "./Components/TypeGame.jsx";
import Profile from "./Components/Profile.jsx";


function App() {
  const [dictionary, setDictionary] = useState([]);
  

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
        <div className="title">
          <div className="spacer"></div>
          <h1 className="titleName">Better Type</h1>
          <Profile/>
        </div>
        <TypeGame dictionary={dictionary} />
    </div>
  );
}

export default App;
