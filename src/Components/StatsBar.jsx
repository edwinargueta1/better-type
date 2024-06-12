export default function StatsBar({  error, accuracy, phraseRunTime, wordsPerMin }) {
  return (
    <div id="statBarAreaWrapper">
      <div id="statBar">
        <p>Stats:</p>
        <p>WPM: {wordsPerMin.toFixed(1)}</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Errors: {error}</p>
        <p>Time: {(phraseRunTime / 1000).toFixed(2)}s</p>
      </div>
    </div>
  );
}