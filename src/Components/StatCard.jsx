import React from "react";

export default function StatCard({title, stat}){
    return(
        <div className="statCardWrapper">
            <div>
                <p>{title}</p>
            </div>
            <div>
                <h1>
                    {stat}
                </h1>
            </div>
        </div>
    )
}