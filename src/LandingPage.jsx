import React from "react";
import Logo from "./assets/Ellipse4.png";
import HeroImg from "./assets/Background.png";
import AboutUsImg from "./assets/Running.png";
import Files from "./assets/Files.png";
import Cloud from "./assets/Cloud.png";
import Trends from "./assets/Trends.png";
import Line1 from "./assets/line1.svg";
import Line2 from "./assets/line2.svg";

import "./LandingPage.css";

function LandingPage() {
  return (
    <>
      <div className="navbar">
        <div className="vitaLogo">
          <img src={Logo} className="navbarLogo" draggable={false} />
          <p className="navbarName">VitaTrack</p>
        </div>
        <div className="links">
          <a href="#home">
            <p>Home</p>
          </a>
          <a href="#about">
            <p>About</p>
          </a>
          <a href="#features">
            <p>Features</p>
          </a>
          <a href="#howItWork">
            <p>How it works</p>
          </a>
        </div>
        <div className="loginButtons">
          <button className="loginBtn">Login</button>
          <button className="registerBtn">Get Started</button>
        </div>
      </div>
      <div className="heroContainer">
        <img src={HeroImg} className="heroImg" id="home" />
        <div className="heroP">
          <h1 className="heroLine1">Track your health.</h1>
          <h1 className="heroLine2">Transform your habits.</h1>
          <p>
            VitaTrack helps you log workouts, calories, water and weight in{" "}
            <br /> one simple dashboard, so you can see real progress every day.
          </p>
          <button className="registerBtn2">Start tracking now</button>
        </div>
      </div>
      <div className="statisticContainer">
        <div className="statistic">
          <div className="stat">
            <div className="textInside">
              <p className="statTop">500+</p>
              <p className="statBot">Users</p>
            </div>
          </div>
          <div className="stat">
            <div className="textInside">
              <p className="statTop">30+</p>
              <p className="statBot">minutes of activity daily</p>
            </div>
          </div>
          <div className="stat">
            <div className="textInside">
              <p className="statTop">50+</p>
              <p className="statBot">goals completed</p>
            </div>
          </div>
          <div className="stat">
            <div className="textInside">
              <p className="statTop">100%</p>
              <p className="statBot">data in one place</p>
            </div>
          </div>
        </div>
      </div>
      <div className="backgroundContainer">
        <div className="aboutUs">
          <div className="aboutLeft">
            <p className="aboutTop" id="about">
              A few words about us
            </p>
            <p className="aboutBot">
              VitaTrack started as a side project after noticing how many
              fitness apps are bloated with complex features and noisy
              dashboards. The goal was to create something lightweight and
              friendly that feels more like a daily check‑in than another task
              on your to‑do list. Every screen is designed to be calm, focused
              and easy to understand at a glance.
            </p>
          </div>
          <div className="aboutRight">
            <img src={AboutUsImg} draggable={false} />
          </div>
        </div>
        <div className="features">
          <p id="features">Stay on top of your health, one habit at a time.</p>
          <div className="cardContainer">
            <div className="card">
              <div className="cardContent">
                <img src={Files} draggable={false} />
                <p className="cardTop">All your habits in one place</p>
                <p className="cardBot">
                  View sleep, water and calories in a clean, simple dashboard so
                  you always know where you stand.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="cardContent">
                <img src={Cloud} draggable={false} />
                <p className="cardTop">Log progress in seconds</p>
                <p className="cardBot">
                  Add water or calories with one tap using smart presets,
                  without digging through complex menus.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="cardContent">
                <img src={Trends} draggable={false} />
                <p className="cardTop">See trends, not just numbers</p>
                <p className="cardBot">
                  Track weekly and monthly patterns to spot what is working and
                  adjust your habits faster.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="howItWork">
          <p id="howItWork">How VitaTrack works</p>
          <div className="steps">
            <div className="step step1">
              <div className="circle">1</div>
              <div className="circleP">
                <p className="circleTitle">Create your profile</p>
                <p className="circleDesc">
                  Set your daily goals for water, sleep and calories.
                </p>
              </div>
            </div>

            <img src={Line1} className="line line1" draggable={false} />

            <div className="step step2">
              <div className="circle">2</div>
              <div className="circleP">
                <p className="circleTitle">Log your day</p>
                <p className="circleDesc">
                  Add entries in a few taps using smart presets.
                </p>
              </div>
            </div>

            <img src={Line2} className="line line2" draggable={false} />

            <div className="step step3">
              <div className="circle">3</div>
              <div className="circleP">
                <p className="circleTitle">See your progress</p>
                <p className="circleDesc">
                  Track trends and adjust your habits with simple charts.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <p>© 2025 VitaTrack. All rights reserved.</p>
          <div className="footerLinks">
            <a href="#home">
              <p>Home</p>
            </a>
            <a href="#about">
              <p>About</p>
            </a>
            <a href="#features">
              <p>Features</p>
            </a>
            <a href="#howItWork">
              <p>How it works</p>
            </a>
            <a href="https://www.otomoto.pl/osobowe/polonez">
              <p>PrivacyPolicy</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
