import React, { useState, useEffect, useRef } from "react";

export default function TextBox({
  dictionary,
  phrase,
  setPhrase,
  getNewPhrase,
  setPhraseRunTime,
  error,
  setError,
  accuracy,
  setAccuracy,
  calculateAccuracy,
  setWordsPerMin,
  addNewPhraseData
}) {
  //Component level Variables
  const [focused, setFocused] = useState(false);
  const phraseStartTime = useRef(null);
  const [indexOfCurLetter, setIndexOfCurLetter] = useState(0);
  const [completedWords, setCompletedWords] = useState(1);
  const onlyLettersRegex = new RegExp("[A-Za-z\\s]");
  const englishAverageWord = 5;

  const STATUS = {
    UNTYPED: "untyped",
    TYPED: "typed",
    ERROR: "error",
    TYPED_ERROR: "typedError",
  };

  //Generates a phrase after dictionary gets built
  useEffect(() => {
    if (dictionary.length > 0) {
      getNewPhrase();
    }
  }, [dictionary]);

  //Event listener for keyboard input
  useEffect(() => {
    if (phrase.length > 0) {
      //Mount
      document.addEventListener("keydown", handleKeyPress);

      //Remove
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [phrase, focused]);

  useEffect(() => {
    if (phraseStartTime.current === null) return;

    //Updating the time
    let interval = setInterval(() => {
      let curTime = performance.now();
      let elapsedTimeInSec = (curTime - phraseStartTime.current) / 1000;
      setPhraseRunTime(() => {
        return curTime - phraseStartTime.current;
      });
      setWordsPerMin(() => {
        return ((indexOfCurLetter/englishAverageWord) / elapsedTimeInSec) * 60;
      });
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [phraseStartTime.current, completedWords]);

  //Rerenders Accuracy
  useEffect(() => {
    if(phraseStartTime.current !== null){
      setAccuracy(calculateAccuracy(error, phrase.length));
    }
  }, [indexOfCurLetter, error, phraseStartTime.current])
  

  function handleKeyPress(event) {
    if (!focused) return;

    let isValidInput =
      event.key.length === 1 &&
      onlyLettersRegex.test(event.key);

      console.log(`phraseTime: ${phraseStartTime.current}   isValid: ${isValidInput}`)
    if (phraseStartTime.current === null && isValidInput) {
      console.log('error reset 1');
      //Resetting Variables
      setPhraseRunTime(0);
      setError(0);
      setCompletedWords(0);
      setAccuracy(0);
      phraseStartTime.current = performance.now();
    }

    let curPhrase = [...phrase];

    //Key Input Logic
    if (isValidInput) {
      //if it already labeled as an error
      if (curPhrase[indexOfCurLetter].status === STATUS.ERROR) {
        if (curPhrase[indexOfCurLetter].char === event.key) {
          if (curPhrase[indexOfCurLetter].char === " ") {
            setCompletedWords((prev) => prev + 1);
          }
          curPhrase[indexOfCurLetter].status = STATUS.TYPED_ERROR;
          setIndexOfCurLetter((prev) => prev + 1);
        }
      } else {
        //if the character is equal to the input
        if (curPhrase[indexOfCurLetter].char === event.key) {
          setPhrase(curPhrase);
          //if Space
          if (curPhrase[indexOfCurLetter].char === " ") {
            setCompletedWords((prev) => prev + 1);
          }
          curPhrase[indexOfCurLetter].status = STATUS.TYPED;
          setIndexOfCurLetter((prev) => prev + 1);
        } else {
          curPhrase[indexOfCurLetter].status = STATUS.ERROR;
          setError((prev) => prev + 1);
          console.log(`an error gained ${error}`)
          return;
        }
      }
      setPhrase(curPhrase);
    }

    //Reset if finished
    if (
      indexOfCurLetter >= phrase.length - 1 &&
      curPhrase[indexOfCurLetter].char === event.key
    ) {
      const endTime = performance.now();
      const totalTime = (endTime - phraseStartTime.current);  // Calculate in seconds
      const wpm = ((completedWords + 1) / (totalTime / 1000)) * 60;

      setWordsPerMin(wpm)
      setPhraseRunTime(totalTime);  // This should set the correct time
      getNewPhrase();
      phraseStartTime.current = null;
      addNewPhraseData(wpm, error, totalTime);
      setIndexOfCurLetter(0);
    }
  }

  function resetParams(){
    phraseStartTime.current = null;
    setIndexOfCurLetter(0);
    setError(0);
    setAccuracy(100);
    setPhraseRunTime(0);
    setWordsPerMin(0);
    setCompletedWords(0);
  }

  function isFocused() {
    setFocused(true);
  }
  function isNotFocused() {
    setFocused(false);
  }

  return (
    <div className="typingIndicatorOverlay">
      {focused ? "" : <p className="indicator">Click here to start typing!</p>}
      <div
        id="textBoxWrapper"
        style={{ filter: focused ? "none" : "blur(8px)" }}
        tabIndex={0}
        onFocus={isFocused}
        onBlur={isNotFocused}
      >
        <p>
          {phrase.map((element, index) => {
            return (
              <React.Fragment key={index}>
                {element.status === "untyped" && (
                  <span key={index} id="untyped">
                    {element.renderValue}
                  </span>
                )}
                {element.status === "typed" && (
                  <span key={index} id="typedText">
                    {element.renderValue}
                  </span>
                )}
                {element.status === "error" && (
                  <span key={index} id="errorText">
                    {element.renderValue}
                  </span>
                )}
                {element.status === "typedError" && (
                  <span key={index} id="typedErrorText">
                    {element.renderValue}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </p>
        <button className="clearButton" onClick={() => {
          getNewPhrase();
          resetParams();
        }}>
          New Phrase
        </button>
      </div>
    </div>
  );
}
