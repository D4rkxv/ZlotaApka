import Diving from "./assets/Swimming2.png";
import React, { useState, useEffect } from "react";
import Logo from "./assets/Ellipse4.png";
import Google from "./assets/Google.svg";

import "./LoginPage.css";
import { useAuthLayout } from "./AuthContext";

function LoginPage() {
  const { goToLanding, goToRegister } = useAuthLayout();
  return (
    <div className="formContainer">
      <div className="leftContainer">
        <div className="vitaLogo">
          <img src={Logo} className="navbarLogo" draggable={false} />
          <p className="navbarName">
            <a className="logoName" onClick={goToLanding}>
              VitaTrack
            </a>
          </p>
        </div>
        <div className="loginForm">
          <p>Welcome Back</p>
          <p>Enter your email and password to continue</p>
          <form className="inputForm">
            <div className="inputGroup">
              <input type="text" name="loginInput" id="loginInput" required />
              <label>Login</label>
            </div>
            <div className="inputGroup">
              <input
                type="password"
                name="passwordInput"
                id="passwordInput"
                required
              />
              <label>Password</label>
            </div>
            <div className="underLogin">
              <div className="rememberMeContainer">
                <input
                  type="checkbox"
                  name="rememberCheckbox"
                  id="rememberCheckbox"
                />
                <label>Remember me?</label>
              </div>
              <a href="https://olx.pl" className="link">
                <p className="underlineLink">Forgot Your Password?</p>
              </a>
            </div>
            <button type="submit" className="logInBtn">
              Log In
            </button>
          </form>
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
            <a className="link">
              <p className="underlineLink" onClick={goToRegister}>
                Register Now
              </p>
            </a>
          </div>
        </div>
        <div className="loginFooter">
          <p>© 2025 VitaTrack. All rights reserved.</p>
          <a href="https://www.otomoto.pl/osobowe/polonez" className="link">
            <p className="underlineLink">PrivacyPolicy</p>
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
