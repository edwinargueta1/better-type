import "./App.css";
import React, { useState, useEffect } from "react";
import TypeGame from "./Components/TypeGame.jsx";
import Timer from "./Components/timerTest.jsx";


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
      <div id="background">
        <div className="title">
          <h1>Better Type</h1>
        </div>
        <TypeGame dictionary={dictionary} />

        <Timer/>
      </div>
    </div>
  );
}

export default App;
