import React, { useState } from "react";
import LeaderboardDataTable from "../Components/LeaderboardDataTable";
import WordCountSelector from "../Components/WordCountSelector";

export default function LeaderboardPage(props) {

    const [selectedLeaderboard, setSelectedLeaderboard] = useState(10);

    return (
        <div className="leaderboardWrapper">
            <h1>Top Typers</h1>
            <LeaderboardDataTable 
                user={props.user}
                setStats={props.setStats}
                topUsers={props.topUsers} 
                setTopUsers={props.setTopUsers} 
                selectedLeaderboard={selectedLeaderboard} 
                setSelectedLeaderboard={selectedLeaderboard} 
                loadedTopUsers={props.loadedTopUsers}
                setLoadedTopUsers={props.setLoadedTopUsers} />
            <WordCountSelector setState={setSelectedLeaderboard} curPhraseCount={selectedLeaderboard} />
        </div>
    )
}