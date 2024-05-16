import React, { useState, useEffect, useRef } from "react";

export default function TextBox({
  dictionary,
  phrase,
  setPhrase,
  getNewPhrase,
  setError,
  setPhraseRunTime,
  setWordsPerMin,
  addNewPhraseData
}) {
  //Component level Variables
  const [focused, setFocused] = useState(false);
  const [phraseStartTime, setPhraseStartTime] = useState(null);
  const [indexOfCurLetter, setIndexOfCurLetter] = useState(0);
  const [completedWords, setCompletedWords] = useState(1);
  const onlyLettersRegex = new RegExp("[A-Za-z\\s]");

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

  //Timer runs when it is active
  useEffect(() => {
    if (phraseStartTime === null) return;

    //Updating the time
    let interval = setInterval(() => {
      let curTime = performance.now();
      let elapsedTimeInSec = (curTime - phraseStartTime) / 1000;
      setPhraseRunTime(() => {
        return curTime - phraseStartTime;
      });
      let offset = 1;
      setWordsPerMin(() => {
        return ((completedWords + offset) / elapsedTimeInSec) * 60;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [phraseStartTime, completedWords]);

  

  function handleKeyPress(event) {
    if (focused === false) return;

    if (phraseStartTime === null) {
      //Resetting Variables
      setPhraseRunTime(0);
      setError(0);
      setCompletedWords(0);
      setPhraseStartTime(performance.now());
    }
    let curPhrase = [...phrase];
    let isValid =
      event.key.length === 1 &&
      onlyLettersRegex.test(event.key) &&
      curPhrase.length > indexOfCurLetter;

    //Key Input Logic
    if (isValid) {
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
          if (curPhrase[indexOfCurLetter].char === " ") {
            setCompletedWords((prev) => prev + 1);
          }
          curPhrase[indexOfCurLetter].status = STATUS.TYPED;
          setIndexOfCurLetter((prev) => prev + 1);
        } else {
          curPhrase[indexOfCurLetter].status = STATUS.ERROR;
          setError((prev) => prev + 1);
        }
      }
      setPhrase(curPhrase);
    }

    //Reset if finished
    if (phrase.length - 1 <= indexOfCurLetter) {
      addNewPhraseData();
      setPhraseStartTime(null);
      setIndexOfCurLetter(0);
      getNewPhrase();
    }
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
        <button className="clearButton" onClick={getNewPhrase}>
          New Phrase
        </button>
      </div>
    </div>
  );
}
