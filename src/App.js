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
  // const [error, setError] = useState([]);


  async function buildDictionary() {
    //Text Stores all the words in dictionary into an array
    let text = await fetch('/dictionary.txt')
      .then((res) => { return res.text() })
      .then((stuff) => {
        return stuff.split('\r\n');
      }).catch(err => { return `File  Not Found. ${err}` })
    setDictionary(text);
  }

  useEffect(() => {
     // Call getRandomWords after setting dictionary
    getRandomWords();
    console.log('callled getRandomWords')
    console.log(randomWords);
  },[dictionary]); // Call getRandomWords whenever dictionary changes


  //Stores letters of random words in to an array
  function getRandomWords() {
    // console.log(dictionary[0]);
    let newRandomWords = [];
    for (let i = 0; i < 10; i++) {
      let randomIndex = Math.floor(Math.random() * 10000);
      // let word = dictionary[randomIndex];
      let word = 'hellobruh';
      for (let j = 0; j < word.length; j++) {
        newRandomWords.push(word.charAt(j));
      }
      newRandomWords.push(' ');
    }
    setRandomWords(newRandomWords);
  }
  useEffect(() => {
    console.log(`Updated dictionary! ${dictionary.length}`)
  },[dictionary])

  useEffect(() => {
    console.log(`Updated randomWords! ${randomWords}`)
  },[randomWords])

  //So as this component load it will Load all the available words
  let onlyLetters = new RegExp("[A-Za-z\\s]");



  useEffect(() => {
    console.log('dict')
    buildDictionary();
    // Event listener to handle keydown events
    const handleKeyDown = (event,dictionary) => {
      handleKeyPress(event, dictionary);
    };

    // Add event listener when the component mounts
    document.addEventListener('keydown', handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  function handleKeyPress(event, dictionary) {
    //if the letter is valid
    console.log(dictionary)
    console.log(dictionary[0])
    if (event.key.length === 1 && onlyLetters.test(event.key) && randomWords[0] === event.key) {
      const newRandomWords = newRandomWords.slice(0);
      setKeyboard(prevInput => [...prevInput, event.key]);
      setRandomWords(newRandomWords);
    }


    //We need to take input form out of the box of the input 

    //We take in the event add it to the new tag only if;
    //it is a part of the first letter in the array of randomWords
    //If Not
    //Then we dont update any of the variables and output and error

    //The error will be the current wrong letter turned RED.
  }

  console.log(dictionary)
  return (
    <>
      <div>
        <p>Dictionary Length: {dictionary.length}</p>
        <p id='textToBeCompleted'><span id='completedLetters'>{keyboard}</span>{randomWords}</p>
      </div>
    </>
  )
}

export default App;