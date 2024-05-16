import React, { useState, useEffect } from "react";
import TextBox from "./TextBox";
import StatsBar from "./StatsBar";
import DataTable from "./DataTable";

export default function TypeGame({dictionary}) {
  const [phrase, setPhrase] = useState([]);
  const [phraseRunTime, setPhraseRunTime] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMin, setWordsPerMin] = useState(0);

  const [phraseHistoryData, setPhraseHistoryData] = useState([]);

  function Letter(char) {
    this.renderValue = char === " " ? "-" : char;
    this.char = char;
    this.status = "untyped";
  }

  useEffect(()=>{
    console.log(`Count ${phraseHistoryData.length}`)
  },[phraseHistoryData])

  function addNewPhraseData() {
    const curPhraseData = {
      WPM: wordsPerMin,
      accuracy: accuracy,
      errors: error,
      phraseRunTime: phraseRunTime,
      timeCompleted: new Date().toLocaleString()
    };
    const curPhraseHistoryData = [...phraseHistoryData];
    curPhraseHistoryData.push(curPhraseData);
    setPhraseHistoryData(curPhraseHistoryData);
  }

  //Stores letters of random words in to an array
  function getNewPhrase() {
    let newRandomWords = [];
    for (let i = 0; i < 1; i++) {
      let randomDictionaryWord =
        dictionary[Math.floor(Math.random() * dictionary.length)];
      for (let j = 0; j < randomDictionaryWord.length; j++) {
        newRandomWords.push(new Letter(randomDictionaryWord.charAt(j)));
      }
      newRandomWords.push(new Letter(" "));
    }
    newRandomWords.pop();
    setPhrase(newRandomWords);
  }

  //Will recalculate with every key stroke
  useEffect(() => {
    calculateAccuracy(error, phrase.length, setAccuracy);
  }, [phrase]);

  function calculateAccuracy(error, totalChars, setAccuracy) {
    let newAccuracy = Number.isNaN((totalChars - error) / totalChars)
      ? 0
      : (((totalChars - error) / totalChars) * 100).toFixed(2);
    let formated =
      newAccuracy % 1 === 0 ? Math.floor(newAccuracy) : newAccuracy;
    setAccuracy(formated);
  }
  return (
    <div id="gameWrapper">
      <StatsBar
        error={error}
        accuracy={accuracy}
        phraseRunTime={phraseRunTime}
        wordsPerMin={wordsPerMin}
      />
      <TextBox
        dictionary={dictionary}
        phrase={phrase}
        setPhrase={setPhrase}
        getNewPhrase={getNewPhrase}
        setPhraseRunTime={setPhraseRunTime}
        error={error}
        setError={setError}
        accuracy={accuracy}
        setWordsPerMin={setWordsPerMin}
        addNewPhraseData={addNewPhraseData}
      />
      <DataTable phraseHistoryData={phraseHistoryData}/>
    </div>
  );
}
