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
  let onlyLetters = new RegExp("[A-Za-z\\s]");

  function Letter(value){
    this.value = value;
    this.status = null;

    // function typed(input){
    //   if(input === this.value){
    //     this.status = 'correct';
    //   }else{
        
    //   }
    // }
  }


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
    // console.log(`Dictionary: ${dictionary[0]}`);
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

    //Code Brainstorm
    //We 
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
  function setLetters() {
    return (
      <>
        <div>{randomWords.map((letter, index) => {
          console.log(index)
          return <Letter key={index} value={letter} color='red'/>
        })}</div>
      </>)
  }
  // function setLetters() {
  //   return (
  //     <div>
  //       {randomWords.map((letter, index) => (
  //         <Letter key={index} value={letter} />
  //       ))}
  //     </div>
  //   );
  // }
 
  return (
    <>
      <div>
        {randomWords.length}
        {setLetters()}



        <p id='textToBeCompleted' style={{color:'orange'}}><span id='completedLetters'>{keyboard}</span>{randomWords}</p>
        <p id='errorCount'>Errors: {error}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>
    </>
  )
}

function Letter(props) {
  return (
    <>
      <span key={props.key} style={{ color: props.color }}>{props.value}</span>
    </>
  )
}

export default App;