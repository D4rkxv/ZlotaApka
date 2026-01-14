import Diving from "./assets/Diving2.png";
import React, { useState, useEffect } from "react";
import Logo from "./assets/Ellipse4.png";
import Google from "./assets/Google.svg";
import "./LoginPage.css";
import { useAuthLayout } from "./AuthContext";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { goToLanding, goToLogin, register, isLoading, error } =
    useAuthLayout();
  const handleChange = (e) => {
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
      console.log("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      console.log("Password must be at least 8 characters long");
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );
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
          <p>Create an Account</p>
          <p>Join now to change your life forever</p>
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
              <label>Name</label>
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
              <label>Login</label>
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
              <label>Confirm Password</label>
            </div>
            <button type="submit" className="logInBtn">
              {isLoading ? "Creating account..." : "Sign Up"}
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
            <p>Already Have Account?</p>
            <a className="link">
              <p className="underlineLink" onClick={goToLogin}>
                Login Now
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

export default RegisterPage;
