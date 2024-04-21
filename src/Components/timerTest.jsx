import React, { useState, useEffect, useRef } from 'react';

function Timer() {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const requestRef = useRef();

  const startTimer = () => {
    setStartTime(performance.now());
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    cancelAnimationFrame(requestRef.current);
  };

  const updateTimer = () => {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    setElapsedTime(elapsedTime);
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    if (startTime === null) return;
    requestRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(requestRef.current);
  }, [startTime]);

  return (
    <div>
      <p>Elapsed Time: {(elapsedTime/1000).toFixed(2)} s</p>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={stopTimer}>Stop Timer</button>
    </div>
  );
}

export default Timer;
