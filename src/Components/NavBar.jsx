import React from "react";
import { Link } from "react-router-dom";

export default function NavBar(){
    return(
        <div className="navBarWrapper">
            <nav className="navBar">
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/Profile'>Profile</Link>
                    </li>
                    <li>
                        <Link to='/Leaderboard'>Leaderboard</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}