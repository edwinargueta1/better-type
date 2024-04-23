import React from "react";

export default function Login(){
    return (
      <div className="loginContainer">
        <label>Email</label>
        <input placeholder="Email..."></input>
        <label>Password</label>
        <input placeholder="Password..."></input>
      </div>
    );
}