export default function StatsBar({  error, accuracy, phraseRunTime, wordsPerMin }) {
  return (
    <div className="statBarAreaWrapper">
      <div className="statBar">
        <p>WPM: <span className="values">{wordsPerMin.toFixed(1)}</span></p>
        <p>Accuracy: <span className="values">{accuracy}%</span></p>
        <p>Errors: <span className="values">{error}</span></p>
        <p>Time: <span className="values">{(phraseRunTime / 1000).toFixed(2)}s</span></p>
      </div>
    </div>
  );
}