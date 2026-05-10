import Diving from "./assets/Diving2.png";
import React, { useState } from "react";
import Logo from "./assets/Ellipse4.png";
import Google from "./assets/Google.svg";
import Github from "./assets/Github.svg";
import "./LoginPage.css";
import { useAuthLayout } from "./AuthContext";
import { useLanguage } from "./LanguageContext.jsx";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");
  const { t } = useLanguage();
  const l = t.register;

  const { goToLanding, goToLogin, register, isLoading } = useAuthLayout();
  const handleChange = (e) => {
    setLocalError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError(l.allFieldsRequired);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError(l.passwordsMismatch);
      return;
    }
    if (formData.password.length < 8) {
      setLocalError(l.passwordTooShort);
      return;
    }

    await register(formData.name, formData.email, formData.password);
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
          <p>{l.createAccount}</p>
          <p>{l.subtitle}</p>
          <form className="inputForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <input
                type="text"
                name="name"
                id="nameInput"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <label>{l.name}</label>
            </div>
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
              <label>{l.emailLabel}</label>
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
            <div className="inputGroup">
              <input
                type="password"
                name="confirmPassword"
                id="repPasswordInput"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <label>{l.confirmPassword}</label>
            </div>
            <p className="errorHandler">{localError}</p>
            <button type="submit" className="logInBtn">
              {isLoading ? l.creatingAccount : l.signUp}
            </button>
          </form>
          <div className="anotherOptions">
            <p>{l.orLoginWith}</p>
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
            <p>{l.alreadyHaveAccount}</p>
            <a className="link">
              <p className="underlineLink" onClick={goToLogin}>
                {l.loginNow}
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
      <div className="rightContainer">
        <img src={Diving} />
      </div>
    </div>
  );
}

export default RegisterPage;
