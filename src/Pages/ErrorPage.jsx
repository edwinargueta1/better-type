import React from "react";

export default function ErrorPage(props) {

    return (
        <div className="pageWrapper">
            <div className="pageIndicator">
                <h1>{props.error}</h1>
            </div>
        </div>
    )
}