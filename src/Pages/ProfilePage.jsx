import React, { useState, useEffect } from "react";
import { fetchStats } from "../config/firebase";
import StatCard from "../Components/StatCard";
import { toHHMMSS } from "../Functions/conversions";
import ErrorPage from "./ErrorPage";

export default function ProfilePage(props){

    const [isLoading, setIsLoading] = useState(false);

    //Set user Information
    useEffect(() => {
      if(!props.isProfileStatsLoaded.current){
        setIsLoading(true);
        fetchStats(props.user, props.setStats);
        props.isProfileStatsLoaded.current = true;
      }
      setIsLoading(false);
    }, [props.user])

    return (
      <div className="pageWrapper">
        {props.stats !== null ? (
          <div className="profilePage">
            <h1 className="userNameProfile">{props.user?.displayName}</h1>
            <p className="joinDateProfile">
              Joined{" "} 
              {new Date(props.user?.metadata.creationTime).toLocaleDateString()}
            </p>
            <div className="profileRow">
              <StatCard title="Highest WPM 10:" stat={(props.stats.highestWPM10)}/>
              <StatCard title="Highest WPM 20:" stat={(props.stats.highestWPM20)}/>
              <StatCard title="Highest WPM 30:" stat={(props.stats.highestWPM30)}/>
            </div>
            <div><h1>Overall</h1></div>
            <div className="profileRow">
              <StatCard title="Average WPM:" stat={parseFloat((props.stats.averageWPM ?? 0).toFixed(2))}/>
              <StatCard title="Average Accuracy:" stat={`${parseFloat((props.stats.averageAccuracy ?? 0).toFixed(2))}%`}/>
            </div>
            <div className="profileRow">
              <StatCard title="Total Errors:" stat={props.stats.totalErrors}/>
              <StatCard title="Total Lessons:" stat={props.stats.lessons}/>
              <StatCard title="Total Time Typing:" stat={toHHMMSS(props.stats.totalTimeInSec)}/>
            </div>
          </div>
        ) : (
          isLoading ? (<ErrorPage error="Loading..."/>) : (<ErrorPage error="Login or Sign up to view Profile Stats"/>)
        )}
      </div>
    );
}