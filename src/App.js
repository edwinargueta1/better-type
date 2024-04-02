import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <div className="App">
      <div id='background'>
        <div id='textBox'>
          <TextBox />
        </div>
      </div>
    </div>
  );
}

function TextBox() {
  const [dictionary, setDictionary] = useState([]);
  const [randomWords, setRandomWords] = useState([]);
  const [keyboard, setKeyboard] = useState([]);

  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  let repeat = false;


  useEffect(() => {
    async function buildDictionary() {
      //Text Stores all the words in dictionary into an array
      let text = await fetch('/dictionary.txt')
        .then((res) => { return res.text() })
        .then((stuff) => {
          return stuff.split('\r\n');
        }).catch(err => { return `File  Not Found. ${err}` })
      setDictionary(text);
    }
    buildDictionary();
  }, []); // Call getRandomWords whenever dictionary changes

  //Stores letters of random words in to an array
  function getRandomWords() {
    let newRandomWords = [];
    console.log(`Dictionary: ${dictionary[0]}`);
    for (let i = 0; i < 10; i++) {
      let randomIndex = Math.floor(Math.random() * 10000);
      let word = dictionary[randomIndex];
      for (let j = 0; j < word.length; j++) {
        newRandomWords.push(word.charAt(j));
      }
      newRandomWords.push(' ');
    }
    setRandomWords(newRandomWords);
  }
  


  useEffect(() => {
    if(dictionary.length > 0){
      // Call getRandomWords after setting dictionary
      getRandomWords();
    }
  },[dictionary])


  //DEBUGGING
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('keydown', handleKeyPress);
    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };

  },[randomWords])

  //So as this component load it will Load all the available words
  let onlyLetters = new RegExp("[A-Za-z\\s]");

  function handleKeyPress(event) {
    //if the letter is valid
    if (event.key.length === 1 && onlyLetters.test(event.key) && randomWords[0] === event.key) {
      let newRandomWords = randomWords.slice(1);
      setKeyboard(prevInput => [...prevInput, event.key]);
      setRandomWords(newRandomWords);
      repeat = false;

      //If there is no more letters then restart
      if (randomWords.length === 1) {
        getRandomWords();
        setKeyboard([]);
        setError(0);
      }
    }else{
      if(repeat === false){
        setError((prevError) => prevError = prevError + 1);
        repeat = true;
      }
    }

    //We need to take input form out of the box of the input

    //We take in the event add it to the new tag only if;
    //it is a part of the first letter in the array of randomWords
    //If Not
    //Then we dont update any of the variables and output and error

    //The error will be the current wrong letter turned RED.
  }
  //Will recalculate with every key stroke
  useEffect(() => {
    calculateAccuracy();
  }, [keyboard]) 
  //
  function calculateAccuracy(){
    let newAccuracy = Number.isNaN((keyboard.length - error) / keyboard.length) ? 0 : (((keyboard.length - error) / keyboard.length)*100).toFixed(2);
    let formated = (newAccuracy% 1 === 0 ) ? Math.floor(newAccuracy) : (newAccuracy);
    setAccuracy(formated);
  }

  return (
    <>
      <div>
        <p id='textToBeCompleted'><span id='completedLetters'>{keyboard}</span>{randomWords}</p>
        <p id='errorCount'>Errors: {error}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>
    </>
  )
}

export default App;