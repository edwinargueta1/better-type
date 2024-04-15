import React, { useState, useEffect } from "react";
import TextBox from "./TextBox";
import StatsBar from "./StatsBar";

export default function TypeGame({dictionary}) {

  const [keyboard, setKeyboard] = useState([]);
  const [phraseRunTime, setPhraseRunTime] = useState(0);
  const [error, setError] = useState(0);
  const [accuracy, setAccuracy] = useState(100);


  //Will recalculate with every key stroke
  useEffect(() => {
    calculateAccuracy();
  }, [keyboard]);

  function calculateAccuracy() {
    let newAccuracy = Number.isNaN((keyboard.length - error) / keyboard.length)
      ? 0
      : (((keyboard.length - error) / keyboard.length) * 100).toFixed(2);
    let formated =
      newAccuracy % 1 === 0 ? Math.floor(newAccuracy) : newAccuracy;
    setAccuracy(formated);
  }
  return (
    <>
    <StatsBar error={error} accuracy={accuracy} />
      <div id="textBox">
        <TextBox
          dictionary={dictionary}
          phraseRunTime={phraseRunTime}
          keyboard={keyboard}
          setKeyboard={setKeyboard}
          setError={setError}
        />
      </div>
    </>
  );
}
