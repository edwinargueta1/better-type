export default function StatsBar({ prevError, error, prevAccuracy, accuracy }) {
  return (
    <div id="statBarAreaWrapper">
      <div id="statBar">
        <p>Previous Lesson:</p>
        <p>Accuracy: {prevAccuracy}%</p>
        <p>Errors: {prevError} </p>
        <p>Errors: {error}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>
    </div>
  );
}