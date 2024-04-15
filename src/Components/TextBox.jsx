import React, { useState, useEffect } from "react";

export default function TextBox({
  dictionary,
  phraseRunTime,
  error,
  setError,
  accuracy,
  keyboard,
  setKeyboard,
  setPrevError,
  setPrevAccuracy
}) {
  const [randomWords, setRandomWords] = useState([]);
  let onlyLetters = new RegExp("[A-Za-z\\s]");

  function Letter(char) {
    this.renderValue = char;
    this.char = char;
    this.status = 'untyped';
  }

  //Stores letters of random words in to an array
  function getRandomWords() {
    let newRandomWords = [];
    // console.log(`Dictionary: ${dictionary[0]}`);
    for (let i = 0; i < 10; i++) {
      let randomIndex = Math.floor(Math.random() * 10000);
      let word = dictionary[randomIndex];
      for (let j = 0; j < word.length; j++) {
        newRandomWords.push(word.charAt(j));
      }
      newRandomWords.push(" ");
    }
    newRandomWords.pop();
    setRandomWords(newRandomWords);
  }

  //Calls the phrase to be genereated
  useEffect(() => {
    if (dictionary.length > 0) {
      // Call getRandomWords after setting dictionary
      getRandomWords();
    }
  }, [dictionary]);

  //Event listener
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("keydown", handleKeyPress);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [randomWords]);

  function handleKeyPress(event) {
    let typedList = [...keyboard];
    let isValid =
      event.key.length === 1 &&
      onlyLetters.test(event.key);

    let curCharacter = new Letter(randomWords[0]);
    if(curCharacter.char === ' '){
      curCharacter.renderValue = '•';
    }
    
    let lastInput = (typedList[typedList.length -1] !== undefined) ? typedList[typedList.length -1] : curCharacter;

    if (isValid) {
      if (lastInput.status === "error") {
        if (lastInput.char === event.key) {
          lastInput.status = "typedError";
          setKeyboard(typedList);
        }
      } else {
        if (randomWords[0] === event.key) {
          let newRandomWords = randomWords.slice(1);
          curCharacter.status = "typed";
          setKeyboard((prev) => [...prev, curCharacter]);
          setRandomWords(newRandomWords);
        } else {
          curCharacter.status = "error";
          curCharacter.char = randomWords[0];
          let newRandomWords = randomWords.slice(1);
          setKeyboard((prev) => [...prev, curCharacter]);
          setError((prev) => (prev+1));
          setRandomWords(newRandomWords);
        }
      }
    }

    //If there is no more letters then restart
    if (randomWords.length <= 1) {
      setPrevError(error);
      setPrevAccuracy(accuracy);
      getRandomWords();
      setKeyboard([]);
      setError(0);

    }
  }

  return (
    <>
      <div>
        <p>
          {keyboard.map((element, index) => {
            return (
              <React.Fragment key={index}>
                {element.status === "typed" && (
                  <span key={index} style={{ color: "green" }}>
                    {element.renderValue}
                  </span>
                )}
                {element.status === "error" && (
                  <span key={index} style={{ color: "red" }}>
                    {element.renderValue}
                  </span>
                )}
                {element.status === "typedError" && (
                  <span key={index} style={{ color: "orange" }}>
                    {element.renderValue}
                  </span>
                )}
              </React.Fragment>
            );
          })}
          {randomWords}
        </p>
      </div>
    </>
  );
}