import React, { useState, useEffect, useRef } from "react";
import TextBox from "./TextBox";
import StatsBar from "./StatsBar";
import DataTable from "./DataTable";
import {
  sendToPhraseDatabase,
  createFirebaseTimestamp,
  getUserStats,
} from "../config/firebase.js";

export default function TypeGame({ user, dictionary }) {
  const [phrase, setPhrase] = useState([]);
  const [phraseRunTime, setPhraseRunTime] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMin, setWordsPerMin] = useState(0);

  const [phraseHistoryData, setPhraseHistoryData] = useState([]);
  let localStoragePhraseData = useRef([]);
  let phraseWordCount = useRef(10);
  const LESSON_BUFFER = 5;

  //Debuggingg----------
  useEffect(() => {
    // console.log(phraseHistoryData);
  }, [phraseHistoryData]);

  //Local Storage Access
  useEffect(() => {
    // console.log(localStoragePhraseData.current, phraseHistoryData);
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

  function setPhraseLength(len = 10) {
    phraseWordCount.current = len;
    getNewPhrase();
  }

  function addNewPhraseData(wpm, err, totalTime) {
    // console.log(`ran AddNewPhraseData`, phraseHistoryData);
    setAccuracy(calculateAccuracy(err, phrase.length));
    // console.log(createFirebaseTimestamp())
    // console.log(typeof wpm, wpm , wpm.toFixed(1))
    const curPhraseData = {
      WPM: Number(wpm.toFixed(1)),
      accuracy: accuracy,
      errors: err,
      phraseRunTime: Number((totalTime / 1000).toFixed(2)),
      timeCompleted: createFirebaseTimestamp(), //createFirebaseTimestamp(), //new Date().getTime(),
    };

    sendToPhraseDatabase(user, curPhraseData);

    const curPhraseHistoryData = [...phraseHistoryData];
    curPhraseHistoryData.push(curPhraseData);

    localStoragePhraseData.current.push(curPhraseData);
    console.log(`Check`, localStoragePhraseData.current, phraseHistoryData); ///////------------------

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
    getUserStats(user, "WPM"); // Add Page for this
  }

  //Stores letters of random words in to an array
  function getNewPhrase() {
    let newRandomWords = [];
    for (let i = 0; i < phraseWordCount.current; i++) {
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
      newAccuracy % 1 === 0 ? Math.floor(newAccuracy) : Number(newAccuracy);
    return formated;
  }

  return (
    <div className="gameWrapper">
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
        setPhraseLength={setPhraseLength}
        getNewPhrase={getNewPhrase}
        setPhraseRunTime={setPhraseRunTime}
        error={error}
        setError={setError}
        setAccuracy={setAccuracy}
        calculateAccuracy={calculateAccuracy}
        wordsPerMin={wordsPerMin}
        setWordsPerMin={setWordsPerMin}
        addNewPhraseData={addNewPhraseData}
        phraseWordCount={phraseWordCount}
      />
      <DataTable phraseHistoryData={phraseHistoryData} />
    </div>
  );
}
