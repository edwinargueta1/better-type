import React, { useState, useEffect } from "react";
import { getUserStats } from "../config/firebase";

export default function ProfilePage({user}){

    const [stats, setStats] = useState(null);

    //Set user Information
    useEffect(() => {
        fetchStats();
    }, [user])

    async function fetchStats(){
        if (user) {
            let userStats = await getUserStats(user);
            setStats(userStats);
        }
    }
    

    return (
      <div className="profilePageWrapper">
        {stats !== null ? (
          <div className="profilePage">
            <h1>{user?.displayName}</h1>
            <p>
              Joined{" "} 
              {new Date(user?.metadata.creationTime).toLocaleDateString()}
            </p>
            <p>Average WPM: {(stats.averageWPM).toFixed(2)}</p>
            <p>Average Accuracy: {(stats.averageAccuracy).toFixed(2)}</p>
            <p>Total Errors: {stats.totalErrors}</p>
            <p>Total Lessons: {stats.lessons}</p>
            <p>Total Time Spent: {(stats.totalTime).toFixed(2)}s</p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    );
}