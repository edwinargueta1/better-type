import React, { useState, useEffect, useRef } from "react";

export default function TextBox({
  dictionary,
  phrase,
  setPhrase,
  phraseRunTime,
  error,
  setError,
  accuracy,
  setPrevError,
  setPrevAccuracy
}) {
  let [indexOfCurLetter, setIndexOfCurLetter] = useState(0);
  let onlyLetters = new RegExp("[A-Za-z\\s]");

  function Letter(char) {
    this.renderValue = char;
    this.char = char;
    this.status = 'untyped';
  }

  const STATUS = {
    UNTYPED: 'untyped',
    TYPED: 'typed',
    ERROR: 'error',
    TYPED_ERROR: 'typedError'
  }

  //Stores letters of random words in to an array
  function getNewPhrase() {
    let newRandomWords = [];
    // console.log(`Dictionary: ${dictionary[0]}`);
    for (let i = 0; i < 10; i++) {
      let randomDictionaryWord = dictionary[Math.floor(Math.random() * dictionary.length)];
      for (let j = 0; j < randomDictionaryWord.length; j++) {
        newRandomWords.push(new Letter(randomDictionaryWord.charAt(j)));
      }
      newRandomWords.push(new Letter(" "));
    }
    newRandomWords.pop();
    setPhrase(newRandomWords);
  }

  //Calls the phrase to be genereated
  useEffect(() => {
    if (dictionary.length > 0) {
      // Call getRandomWords after setting dictionary
      getNewPhrase();
    }
    
  }, [dictionary]);

  //Event listener
  useEffect(() => {
    if (phrase.length > 0) {
      // Add event listener when the component mounts
      document.addEventListener("keydown", handleKeyPress);

      // Remove event listener when the component unmounts
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [phrase]);

  function handleKeyPress(event) {
    let curPhrase = [...phrase];
    let isValid =
      event.key.length === 1 &&
      onlyLetters.test(event.key) &&
      curPhrase.length > indexOfCurLetter;
    console.log(indexOfCurLetter)


    if (isValid) {
      //if it already labeled as an error
      if (curPhrase[indexOfCurLetter].status === STATUS.ERROR) {
        if(curPhrase[indexOfCurLetter].char === event.key){
          curPhrase[indexOfCurLetter].status = STATUS.TYPED_ERROR;
          setIndexOfCurLetter(prev => prev + 1)
        }
      } else {
        //if the character is equal to the input
        if (curPhrase[indexOfCurLetter].char === event.key) {
          curPhrase[indexOfCurLetter].status = STATUS.TYPED;
          setIndexOfCurLetter(prev => prev + 1)
        } else {
          curPhrase[indexOfCurLetter].status = STATUS.ERROR;
          setError(prev => prev + 1)
          
        }
      }
      setPhrase(curPhrase);
    }
    
    //If there is no more letters then restart
    console.log(`pL: ${phrase.length}  and  i: ${indexOfCurLetter}`)
    if (phrase.length-1 <= indexOfCurLetter) {
      setPrevError(error);
      setPrevAccuracy(accuracy);
      setIndexOfCurLetter(0)
      getNewPhrase();
      setError(0);
    }
  }

  return (
    <div id="textBoxWrapper">
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
    </div>
  );
}