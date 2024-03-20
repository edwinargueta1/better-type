import './App.css';
import './dictionary.txt';
import React, {useState, useEffect} from 'react';

function App() {
  return (
    <div className="App">

      <div id='background'>
        <div id='textBox'>
          <p id='text' onLoad={change()}>words</p>
        </div>
      </div>
      
      
    </div>
  );
}

function change(){
  // let text = document.getElementById(text);
  // console.log(text);
}

function randomWords() {
  let listOfWords = [];

  fetch('./dictionary.txt')
  .then(response => response.text())
  .then(data => {
    console.log(data); 
    listOfWords = data;// Do something with the file content
  })
  .catch(error => {
    console.error('Error reading file:', error);
  });
  
  // let fs = require('fs');
  // fs.readFile('./dictionary.txt' , function(err, data){
  //   if(err) throw err;
  //   var array = data.toString().split('\n');
  //   for(let i in array){
  //     console.log(array[i])
  //   }
  // })
  // let file = require('./dictionary.txt');

  // // console.log(file);
  // fetch('./dictionary.txt')
  // .then(response => response.text())
  // .then(TEXT => {
  //   dict = TEXT.toString().split('\n');
  // })
  // dict = [1,2,3,4,  'bruh']
  // console.log(dict);
  // file.toString().split('\n');
  for (let i = 0; i < 10; i++) {

  }

}

export default App;
