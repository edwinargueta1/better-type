import React, {useState, useRef, useEffect} from "react";
export default function Profile(){
  return (
    <div className="menuBackground">
      <div className="profileContainer">
        <p className="accountName">Guest</p>
        <button className="loginButton"></button>
        <button className="signUpButton"></button>
      </div>
    </div>
  );
}