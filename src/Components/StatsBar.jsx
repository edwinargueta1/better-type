export default function StatsBar({  error, accuracy, phraseRunTime, wordsPerMin }) {
  return (
    <div id="statBarAreaWrapper">
      <div id="statBar">
        <p>Lesson Stats:</p>
        <p>Errors: {error}</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Time: {(phraseRunTime/1000).toFixed(2)}</p>
        <p>WPM: {wordsPerMin.toFixed(1)}</p>
      </div>
    </div>
  );
}