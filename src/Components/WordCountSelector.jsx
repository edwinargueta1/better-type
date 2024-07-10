import React from "react";

export default function WordCountSelector({ setState, curPhraseCount }) {

    return (
        <div className="utilBarWrapper">
            <button onClick={() => { setState(10) }} className={(curPhraseCount.current == 10 || curPhraseCount == 10) ? "selected" : ""}>10</button>
            <button onClick={() => { setState(20) }} className={(curPhraseCount.current == 20 || curPhraseCount == 20) ? "selected" : ""}>20</button>
            <button onClick={() => { setState(30) }} className={(curPhraseCount.current == 30 || curPhraseCount == 30) ? "selected" : ""}>30</button>
        </div>
    );
}