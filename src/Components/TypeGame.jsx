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

  function addNewPhraseData(wpm, acc, err, totalTime) {
    //  console.log(`inData: ${phraseRunTime}`);
     setAccuracy(calculateAccuracy(err, phrase.length));
    //  console.log(`errors: ${err} / phrase.length: ${phrase.length}`)
    const curPhraseData = {
      WPM: wpm,
      accuracy: accuracy,
      errors: err,
      phraseRunTime: totalTime,
      timeCompleted: new Date().toLocaleString()
    };
    const curPhraseHistoryData = [...phraseHistoryData];
    curPhraseHistoryData.push(curPhraseData);
    setPhraseHistoryData(curPhraseHistoryData);
  }

  //Stores letters of random words in to an array
  function getNewPhrase() {
    let newRandomWords = [];
    for (let i = 0; i < 2; i++) {
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

  function calculateAccuracy(error, totalChars) {
    let newAccuracy = Number.isNaN((totalChars - error) / totalChars)
      ? 0
      : (((totalChars - error) / totalChars) * 100).toFixed(2);
    let formated =
      newAccuracy % 1 === 0 ? Math.floor(newAccuracy) : newAccuracy;
    return formated;
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
        setAccuracy={setAccuracy}
        calculateAccuracy={calculateAccuracy}
        setWordsPerMin={setWordsPerMin}
        addNewPhraseData={addNewPhraseData}
      />
      <DataTable phraseHistoryData={phraseHistoryData}/>
    </div>
  );
}
