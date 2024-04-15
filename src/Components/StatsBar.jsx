export default function StatsBar({ prevError, error, prevAccuracy, accuracy }) {
  return (
    <>
      <div>
        <p>Previous Lesson:   Accuracy: {prevAccuracy}%  Errors: {prevError} </p>
      </div>
      <p>Errors: {error}</p>
      <p>Accuracy: {accuracy}%</p>
    </>
  );
}