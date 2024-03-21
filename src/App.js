import './App.css';
// import './dictionary.txt';
import React, {useState, useEffect} from 'react';

function App() {
  return (
    <div className="App">

      <div id='background'>
        <div id='textBox'>
          <Change/>
        </div>
      </div>
      
      
    </div>
  );
}

 function Change(){
  const [randomWords, setRandomWords] = useState([]);

  let generateRandomWords = async() => {

    let text = await fetch('/dictionary.txt')
      .then((res) => { return res.text() })
      .then((stuff) => {
         return stuff.split('\r\n');
      }).catch(err => {return `File  Not Found. ${err}`})
    
    //All the values are put into an array
    //Then we need to randomise what gets used
    let randomIndex = new Array(10).fill().map(() => Math.floor(Math.random() * 10000));
    // randomIndex.forEach((e, i) => {randomIndex[i] = Math.floor(Math.random()*10000)});
    let words = [];
    randomIndex.forEach((e, i) => {words.push(text[randomIndex[i]])})
    setRandomWords(words)
  }

  return(
    <>
    <div>
      <button onClick={generateRandomWords}>Generate Random Words</button>
      <p>Random Words:</p>
      <ul>
        {randomWords.map((word, index) => (
          <p key={index}>{word}</p>
        ))}
      </ul>
    </div>
    </>
  )
}

export default App;
