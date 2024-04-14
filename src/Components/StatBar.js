export default function StatBar({accuracy, error}) {

  return (
    <>
      <p>Errors: {error}</p>
      <p>Accuracy: {accuracy}%</p>
    </>
  );
}
