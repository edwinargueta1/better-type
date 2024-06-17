import React from "react";

export default function UtilBar({ getNewPhrase, resetParams, setPhraseLength, phraseWordCount }) {

    return (
        <div className="utilBarWrapper">
            <div>
                <button className="clearButton" onClick={() => {
                    getNewPhrase();
                    resetParams();
                }}>
                    New Phrase
                </button>
                <button onClick={() => { setPhraseLength(10) }} className={phraseWordCount.current == 10 ? "selected" : ""}>10</button>
                <button onClick={() => { setPhraseLength(20) }} className={phraseWordCount.current == 20 ? "selected" : ""}>20</button>
                <button onClick={() => { setPhraseLength(30) }} className={phraseWordCount.current == 30 ? "selected" : ""}>30</button>
            </div>
                {/* Zen Button Implementation */}
        </div>
    );
}