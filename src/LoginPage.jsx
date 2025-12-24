import Diving from "./assets/Swimming2.png";
import React, { useState, useEffect } from "react";
import Logo from "./assets/Ellipse4.png";
import Google from "./assets/Google.svg";

import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="formContainer">
      <div className="leftContainer">
        <div className="vitaLogo">
          <img src={Logo} className="navbarLogo" draggable={false} />
          <p className="navbarName">VitaTrack</p>
        </div>
        <div className="loginForm">
          <p>Welcome Back</p>
          <p>Enter your email and password to continue</p>
          <div className="inputForm">
            <div className="login">
              <label htmlFor="loginInput">Login</label>
              <input type="text" name="loginInput" id="loginInput" />
            </div>
            <div className="password">
              <label htmlFor="passwordInput">Password</label>
              <input type="password" name="passwordInput" id="passwordInput" />
            </div>
          </div>
          <div className="underLogin">
            <div className="rememberMeContainer">
              <input
                type="checkbox"
                name="rememberCheckbox"
                id="rememberCheckbox"
              />
              <label htmlFor="rememberCheckbox">Remember me?</label>
            </div>
            <p>Forgot Your Password?</p>
          </div>
          <button className="logInBtn">Log In</button>
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
            <p>Don’t Have Account?</p>
            <p>Register Now</p>
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

export default LoginPage;
