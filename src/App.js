import './App.css';
import React, {useState, useEffect} from 'react';

function App() {

  return (
    <div className="App">

      <div id='background'>
        <div id='textBox'>
          <TextBox/>
        </div>
      </div>
    </div>
  );
}

 function TextBox(){
  const [dictionary, setDictionary] = useState([]);
  const [randomWords, setRandomWords] = useState([]);

  async function buildDictionary(){
    //Text Stores all the words in dictionary into an array
    let text = await fetch('/dictionary.txt')
      .then((res) => { return res.text() })
      .then((stuff) => {
         return stuff.split('\r\n');
      }).catch(err => {return `File  Not Found. ${err}`})
    setDictionary(text);
  }
  //So as this component load it will Load all the available words
  buildDictionary();

  //Stores letters of random words in to an array
  function getRandomWords(){
    let newRandomWords = [];
    for(let i = 0;  i < 10; i++){
      let randomIndex = Math.floor(Math.random() * 10000);
      let word = dictionary[randomIndex];
      for(let j = 0; j < word.length;j++){
        newRandomWords.push(word.charAt(j));
      }
      newRandomWords.push(' ');
    }
    setRandomWords(newRandomWords);
  }

  return(
    <>
    <div>
      <button onClick={getRandomWords}>Generate Random Words</button>
      <p>{randomWords}</p>
    </div>
    </>
  )
}

export default App;