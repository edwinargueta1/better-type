import React, { useState, useEffect, useRef } from "react";
import TextBox from "./TextBox";
import StatsBar from "./StatsBar";
import DataTable from "./DataTable";
import { sendToDatabase, createFirebaseTimestamp } from "../config/firebase.js";

export default function TypeGame({ dictionary, user }) {
  const [phrase, setPhrase] = useState([]);
  const [phraseRunTime, setPhraseRunTime] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMin, setWordsPerMin] = useState(0);

  const [phraseHistoryData, setPhraseHistoryData] = useState([]);
  let localStoragePhraseData = useRef([]);
  const LESSON_BUFFER = 3;

  //Local Storage Access
  useEffect(() => {
    if (window.localStorage.getItem("storedLessons")) {
      localStoragePhraseData.current = JSON.parse(
        window.localStorage.getItem("storedLessons")
      );
      setPhraseHistoryData(localStoragePhraseData.current);
    }
  }, []);

  function Letter(char) {
    this.renderValue = char === " " ? "-" : char;
    this.char = char;
    this.status = "untyped";
  }

  function addNewPhraseData(wpm, err, totalTime) {
    setAccuracy(calculateAccuracy(err, phrase.length));
    // console.log(createFirebaseTimestamp())
    const curPhraseData = {
      WPM: wpm.toFixed(1),
      accuracy: accuracy,
      errors: err,
      phraseRunTime: (totalTime / 1000).toFixed(2),
      timeCompleted: createFirebaseTimestamp()//createFirebaseTimestamp(), //new Date().getTime(),
    };

    sendToDatabase(user, curPhraseData);

    localStoragePhraseData.current.push(curPhraseData);

    const curPhraseHistoryData = [...phraseHistoryData];
    curPhraseHistoryData.push(curPhraseData);

    while (curPhraseHistoryData.length > LESSON_BUFFER) {
      //shift off the oldest value
      curPhraseHistoryData.shift();
    }
    while (localStoragePhraseData.current.length > LESSON_BUFFER) {
      localStoragePhraseData.current.shift();
    }

    //Storing to local
    window.localStorage.setItem(
      "storedLessons",
      JSON.stringify(localStoragePhraseData.current)
    );
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
        setAccuracy={setAccuracy}
        calculateAccuracy={calculateAccuracy}
        wordsPerMin={wordsPerMin}
        setWordsPerMin={setWordsPerMin}
        addNewPhraseData={addNewPhraseData}
      />
      <DataTable phraseHistoryData={phraseHistoryData} />
    </div>
  );
}
