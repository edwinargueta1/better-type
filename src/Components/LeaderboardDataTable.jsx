import React, { useEffect, useRef } from "react";
import { getUserStats, loadLeaderboard } from "../config/firebase";
import { toHHMMSS } from "../Functions/conversions";
import { updateScores } from "../config/firebase";

export default function LeaderboardDataTable(props) {

    const leaderboardIndex = useRef(0);

    //Loads User Info
    useEffect(() => {
        fetchLeaderboard(props.selectedLeaderboard);
    }, [props.selectedLeaderboard, props.user]);

    function checkAllFalse(obj) {
        return Object.values(obj).every(value => value === false);
    }

    async function fetchLeaderboard(type) {
        if(props.user && checkAllFalse(props.loadedTopUsers.current)){
            const stats = await getUserStats(props.user);
            updateScores(props.user, stats);
        }
        getLeaderboardIndex(type);
        let users = [...props.topUsers];
        let group = `highestWPM${type}`;
        let arrayIndex = leaderboardIndex.current;

        // //Check if loaded
        if ((users[arrayIndex]?.length ?? 0) > 1) {
            return;
        }
        const data = await loadLeaderboard(group);
        setLoaded(type);
        users[arrayIndex] = data;
        props.setTopUsers(users);
    };

    function setLoaded(type){
        props.loadedTopUsers.current[type] = true;
    }
    function getLeaderboardIndex(type) {
        if (type === 10) {
            leaderboardIndex.current = 0;
        } else if (type === 20) {
            leaderboardIndex.current = 1;
        } else if(type === 30) {
            leaderboardIndex.current = 2;
        }
    }

    function renderUserLeaderboard(userGroup) {
        if (userGroup) {
            userGroup.sort((a, b) => b[`highestWPM${props.selectedLeaderboard}`] - a[`highestWPM${props.selectedLeaderboard}`])
            return userGroup.map((element, index) => (
                <tr className='userRow' key={index}>
                    <td><h3>{index + 1}</h3></td>
                    <td>{element.displayName}</td>
                    <td>{element[`highestWPM${props.selectedLeaderboard}`]}</td>
                    <td>{parseFloat((element.averageWPM).toFixed(2))}</td>
                    <td>{toHHMMSS(element.totalTimeInSec)}</td>
                    <td>{element.lessons}</td>
                </tr>
            ))
        }
    }

    return (
        <div className="leaderboardDataTableWrapper">
            {(props.topUsers[leaderboardIndex.current]?.length > 0) ? (
                <table>
                    <thead>
                        <tr>
                            <th colSpan={8}>Top Ranking in {props.selectedLeaderboard} Word Count</th>
                        </tr>
                        <tr>
                            <th>Ranking</th>
                            <th>Username</th>
                            <th>Highest WPM</th>
                            <th>Average WPM</th>
                            <th>Time Typing</th>
                            <th>Lessons</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderUserLeaderboard(props.topUsers[leaderboardIndex.current])}
                    </tbody>
                </table>) : (<h1>No Users to display</h1>)}
        </div>
    )
}