import React, { useState, useEffect } from "react";
import { getUserStats, updateProfile } from "../config/firebase";
import StatCard from "./StatCard";

export default function ProfilePage({user}){

    const [stats, setStats] = useState(null);

    //Set user Information
    useEffect(() => {
        fetchStats();
    }, [user])

    async function fetchStats(){
        try{
          if (user) {
            let userStats = await getUserStats(user);
            console.log(userStats)
            updateProfile(user, userStats);
            setStats(userStats);
          }
        }catch(error){
          console.error(error);
        }
    }

    return (
      <div className="profilePageWrapper">
        {stats !== null ? (
          <div className="profilePage">
            <h1 className="userNameProfile">{user?.displayName}</h1>
            <p className="joinDateProfile">
              Joined{" "} 
              {new Date(user?.metadata.creationTime).toLocaleDateString()}
            </p>
            <div className="profileRow">
              <StatCard title="Average WPM:" stat={(stats.averageWPM).toFixed(2)}/>
              <StatCard title="Average Accuracy:" stat={`${(stats.averageAccuracy).toFixed(2)}%`}/>
            </div>
            <div className="profileRow">
              <StatCard title="Total Errors:" stat={stats.totalErrors}/>
              <StatCard title="Total Lessons:" stat={stats.lessons}/>
              <StatCard title="Total Time:" stat={stats.totalTime}/>
            </div>
          </div>
        ) : (
          <h1>Log in or sign up to view profile stats</h1>
        )}
      </div>
    );
}