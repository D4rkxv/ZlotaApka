import Diving from "./assets/Swimming2.png";
import React, { useState, useEffect } from "react";
import Logo from "./assets/Ellipse4.png";
import Google from "./assets/Google.svg";
import Github from "./assets/Github.svg";

import "./LoginPage.css";
import { useAuthLayout } from "./AuthContext";

function LoginPage() {
  const { goToLanding, goToRegister, login, isLoading, error } =
    useAuthLayout();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("rememberMe") === "true"
  );
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [ localError , setLocalError ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }

    localStorage.setItem("rememberMe", rememberMe);
    const result = await login(formData.email, formData.password, rememberMe);

    if (!result.success) {
      setLocalError(result.error || "Login failed");
    }
  };

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
          <form className="inputForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <input
                type="email"
                name="email"
                id="loginInput"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <label>Email</label>
            </div>
            <div className="inputGroup">
              <input
                type="password"
                name="password"
                id="passwordInput"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <label>Password</label>
            </div>
            <p className="errorHandler">{localError}</p>
            <div className="underLogin">
              <div className="rememberMeContainer">
                <input
                  type="checkbox"
                  name="rememberCheckbox"
                  id="rememberCheckbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberCheckbox">
                  Remember me?
                </label>
              </div>
              <a href="https://olx.pl" className="link">
                <p className="underlineLink">Forgot Your Password?</p>
              </a>
            </div>
            <button type="submit" className="logInBtn">
              {isLoading ? "Logging in..." : "Log In"}
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
              <img src={Github} />
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
