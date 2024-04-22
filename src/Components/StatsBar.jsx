export default function StatsBar({ prevError, error, prevAccuracy, accuracy, phraseRunTime, wordsPerMin }) {
  return (
    <div id="statBarAreaWrapper">
      <div id="statBar">
        <p>Previous Lesson:</p>
        <p>Accuracy: {prevAccuracy}%</p>
        <p>Errors: {prevError} </p>
        <p>Errors: {error}</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Time: {(phraseRunTime/1000).toFixed(2)}</p>
        <p>WPM: {wordsPerMin}</p>
      </div>
    </div>
  );
}