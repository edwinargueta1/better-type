
export default function StatsBar({error, accuracy}){
    return (
      <>
        <p>Errors: {error}</p>
        <p>Accuracy: {accuracy}%</p>
      </>
    );
}