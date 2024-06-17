import React, { useEffect, useState } from "react";
import { loadLeaderboard } from "../config/firebase";

export default function LeaderboardDataTable() {

    const [topUsers, setTopUsers] = useState([]);

    //Loads User Info
    useEffect(()=>{
        let data = async () => {
            return await loadLeaderboard();
        }
        console.log(data().then((res)=>{
            console.log(res);
            setTopUsers(res);
        }));
        // setTopUsers(data);
    },[]);

    function testusers(){
        console.log(topUsers)
    }

    return (
        <div className="leaderboardDataTableWrapper">
            <table>
                <thead>
                    <tr>
                        <th colSpan={6}>Top Ranking</th>
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
                    {topUsers.map((element, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{element.userName}</td>
                                <td>{element.highestWPM}</td>
                                <td>{element.averageWPM}</td>
                                <td>{element.totalTime}</td>
                                <td>{element.lessons}</td>
                            </tr>
                        )
                    })}
                </tbody>


            </table>
            <button onClick={testusers}>test</button>
        </div>
    )
}