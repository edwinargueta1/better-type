import "./App.css";
import React, { useState, useEffect } from "react";
import StatBar from "./Components/StatBar";
import TextBox from "./Components/TextBox";

function App() {
  const [dictionary, setDictionary] = useState([]);
  const [keyboard, setKeyboard] = useState([]);
  const [phraseRunTime, setPhraseRunTime] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

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

  //Will recalculate with every key stroke
  useEffect(() => {
    calculateAccuracy();
  }, [keyboard]);

  function calculateAccuracy() {
    let newAccuracy = Number.isNaN((keyboard.length - error) / keyboard.length)
      ? 0
      : (((keyboard.length - error) / keyboard.length) * 100).toFixed(2);
    let formated =
      newAccuracy % 1 === 0 ? Math.floor(newAccuracy) : newAccuracy;
    setAccuracy(formated);
  }

  return (
    <div className="App">
      <div id="background">
        <div id="stats">
          <StatBar 
          accuracy={accuracy}
          error={error}
          />
        </div>
        <div id="textBox">
          <TextBox
            dictionary={dictionary}
            phraseRunTime={phraseRunTime}
            keyboard={keyboard}
            setKeyboard={setKeyboard}
            setError={setError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
