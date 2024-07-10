import React, { useState, useEffect, useRef } from "react";
import TextBox from "../Components/TextBox.jsx";
import StatsBar from "../Components/StatsBar.jsx";
import DataTable from "../Components/DataTable.jsx";
import {
  sendToPhraseDatabase,
  createFirebaseTimestamp,
} from "../config/firebase.js";

export default function TypeGame({ user, dictionary, setTopUsers, loadedTopUsers, phraseHistoryData, setPhraseHistoryData, isProfileStatsLoaded, setStats}) {
  const [phrase, setPhrase] = useState([]);
  const [phraseRunTime, setPhraseRunTime] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMin, setWordsPerMin] = useState(0);

  
  let localStoragePhraseData = useRef([]);
  let phraseWordCount = useRef(10);
  const LESSON_BUFFER = 5;

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

  function setPhraseLength(len = 10) {
    phraseWordCount.current = len;
    getNewPhrase();
  }
  function resetTopUserData(){
    setTopUsers([[],[],[]]);
    loadedTopUsers.current = {
      10: false,
      20: false,
      30: false
    }
  }
  function clearLocalProfileStats(){
    isProfileStatsLoaded.current = false;
    setStats(null);
  }

  function addNewPhraseData(wpm, err, totalTime, completedWords) {
    resetTopUserData();
    clearLocalProfileStats();
    setAccuracy(calculateAccuracy(err, phrase.length));
    const curPhraseData = {
      WPM: Number(wpm.toFixed(1)),
      accuracy: accuracy,
      errors: err,
      phraseRunTime: Number((totalTime / 1000).toFixed(2)),
      timeCompleted: createFirebaseTimestamp(),
      completedWords: completedWords
    };

    sendToPhraseDatabase(user, curPhraseData);

    const curPhraseHistoryData = [...phraseHistoryData];
    curPhraseHistoryData.unshift(curPhraseData);

    localStoragePhraseData.current.unshift(curPhraseData);

    while (curPhraseHistoryData.length > LESSON_BUFFER) {
      curPhraseHistoryData.pop();
    }
    while (localStoragePhraseData.current.length > LESSON_BUFFER) {
      localStoragePhraseData.current.pop();
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
    <div className="pageWrapper">
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
