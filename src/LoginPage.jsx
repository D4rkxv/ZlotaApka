import Diving from "./assets/Swimming2.png";
import React, { useState } from "react";
import Logo from "./assets/logo.png";
import Google from "./assets/Google.svg";
import Github from "./assets/Github.svg";

import "./LoginPage.css";
import { useAuthLayout } from "./AuthContext";
import { useLanguage } from "./LanguageContext.jsx";

function LoginPage() {
  const { goToLanding, goToRegister, login, isLoading, error } =
    useAuthLayout();
  const { t } = useLanguage();
  const l = t.login;
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
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLocalError(l.fillAllFields);
      return;
    }

    localStorage.setItem("rememberMe", rememberMe);
    const result = await login(formData.email, formData.password, rememberMe);

    if (!result.success) {
      setLocalError(result.error || l.loginFailed);
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
          <p>{l.welcomeBack}</p>
          <p>{l.subtitle}</p>
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
              <label>{l.email}</label>
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
              <label>{l.password}</label>
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
                <label htmlFor="rememberCheckbox">{l.rememberMe}</label>
              </div>
              <a href="https://olx.pl" className="link">
                <p className="underlineLink">{l.forgotPassword}</p>
              </a>
            </div>
            <button type="submit" className="logInBtn">
              {isLoading ? l.loggingIn : l.logIn}
            </button>
          </form>
          <div className="anotherOptions">
            <p>{l.orLoginWith}</p>
          </div>
          <div className="buttons">
            <button disabled>
              <img src={Google} />
              <p>Google</p>
            </button>
            <button disabled>
              <img src={Github} />
              <p>GitHub</p>
            </button>
          </div>
          <div className="underButton">
            <p>{l.noAccount}</p>
            <a className="link">
              <p className="underlineLink" onClick={goToRegister}>
                {l.registerNow}
              </p>
            </a>
          </div>
        </div>
        <div className="loginFooter">
          <p>{l.footer}</p>
          <a href="https://www.otomoto.pl/osobowe/polonez" className="link">
            <p className="underlineLink">{l.privacyPolicy}</p>
          </a>
        </div>
      </div>
      <div className="rightContainer" style={{ backgroundImage: `url(${Diving})` }}>
      </div>
    </div>
  );
}

export default LoginPage;
