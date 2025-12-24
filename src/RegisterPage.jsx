import Diving from "./assets/Diving2.png";
import React, { useState, useEffect } from "react";
import Logo from "./assets/Ellipse4.png";
import Google from "./assets/Google.svg";
import "./LoginPage.css";

function RegisterPage() {
  return (
    <div className="formContainer">
      <div className="leftContainer">
        <div className="vitaLogo">
          <img src={Logo} className="navbarLogo" draggable={false} />
          <p className="navbarName">VitaTrack</p>
        </div>
        <div className="loginForm">
          <p>Create an Account</p>
          <p>Join now to change your life forever</p>
          <div className="inputForm">
            <div className="name">
              <label htmlFor="nameInput">Name</label>
              <input type="text" name="nameInput" id="nameInput" />
            </div>
            <div className="login">
              <label htmlFor="loginInput">Login</label>
              <input type="text" name="loginInput" id="loginInput" />
            </div>
            <div className="password">
              <label htmlFor="passwordInput">Password</label>
              <input type="password" name="passwordInput" id="passwordInput" />
            </div>
            <div className="repPassword">
              <label htmlFor="repPasswordInput">Confirm Password</label>
              <input
                type="password"
                name="repPasswordInput"
                id="repPasswordInput"
              />
            </div>
          </div>

          <button className="logInBtn">Sign Up</button>
          <div className="anotherOptions">
            <p>Or Login With</p>
          </div>
          <div className="buttons">
            <button>
              <img src={Google} />
              <p>Google</p>
            </button>
            <button>
              <img src={Google} />
              <p>GitHub</p>
            </button>
          </div>
          <div className="underButton">
            <p>Already Have Account?</p>
            <p>Login Now</p>
          </div>
        </div>
        <div className="loginFooter">
          <p>© 2025 VitaTrack. All rights reserved.</p>
          <a href="https://www.otomoto.pl/osobowe/polonez">
            <p>PrivacyPolicy</p>
          </a>
        </div>
      </div>
      <div className="rightContainer">
        <img src={Diving} />
      </div>
    </div>
  );
}

export default RegisterPage;
