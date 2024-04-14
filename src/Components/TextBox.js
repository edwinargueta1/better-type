import React, { useState, useEffect } from "react";

export default function TextBox({
  dictionary,
  phraseRunTime,
  setError,
  keyboard,
  setKeyboard,
}) {
  const [randomWords, setRandomWords] = useState([]);
  const [errorChar, setErrorChar] = useState();
  const [repeated, setRepeated] = useState(false);
  let onlyLetters = new RegExp("[A-Za-z\\s]");

  function Letter(char) {
    this.char = char;
    this.status = null;
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
    let isValid =
      event.key.length === 1 &&
      onlyLetters.test(event.key) &&
      randomWords[0] === event.key;

    let curError = errorChar;
    let curCharacter = new Letter();
    curCharacter.char = event.key;
    curCharacter.status = "untyped";

    // console.log(`${curError} and  ${event.key} Equality: ${curError === event.key} Empty: ${curError === ''}`)
    //if the letter is valid
    if (isValid) {
      let newRandomWords = randomWords.slice(1);
      curCharacter.status = "typed";
      if (curCharacter.status !== "error") {
        setKeyboard((prev) => [...prev, curCharacter]);
      }
      setRandomWords(newRandomWords);
      setRepeated(false);

      //If there is no more letters then restart
      if (randomWords.length <= 2) {
        getRandomWords();
        setKeyboard([]);
        setError(0);
      }
    } else {
      curCharacter.status = "error";
      curCharacter.char = randomWords[0];
      curError = randomWords[0];

      if (repeated === false) {
        let newRandomWords = randomWords.slice(1);
        setKeyboard((prev) => [...prev, curCharacter]);
        setRandomWords(newRandomWords);
        setError((prevError) => (prevError = prevError + 1));
      }
      setRepeated(true);
    }
    setErrorChar(curError);
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
                    {element.char}
                  </span>
                )}
                {element.status === "error" && (
                  <span key={index} style={{ color: "red" }}>
                    {element.char}
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
