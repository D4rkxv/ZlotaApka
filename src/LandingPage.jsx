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
import { useAuthLayout } from "./AuthContext";
import { useLanguage } from "./LanguageContext.jsx";

function LandingPage() {
  const { goToLogin, goToRegister } = useAuthLayout();
  const { t, language, setLanguage } = useLanguage();
  const l = t.landing;

  return (
    <>
      <div className="navbar">
        <div className="vitaLogo">
          <img src={Logo} className="navbarLogo" draggable={false} />
          <p className="navbarName">
            <a className="logoName">VitaTrack</a>
          </p>
        </div>
        <div className="links">
          <a href="#home" className="landingLink">
            <p className="underlineLandingLink">{l.navHome}</p>
          </a>
          <a href="#about" className="landingLink">
            <p className="underlineLandingLink">{l.navAbout}</p>
          </a>
          <a href="#features" className="landingLink">
            <p className="underlineLandingLink">{l.navFeatures}</p>
          </a>
          <a href="#howItWork" className="landingLink">
            <p className="underlineLandingLink">{l.navHowItWorks}</p>
          </a>
        </div>
        <div className="loginButtons">
          <div className="landingLangSwitch">
            <button
              className={`landingLangBtn ${language === "en" ? "landingLangActive" : ""}`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <span className="landingLangSep">|</span>
            <button
              className={`landingLangBtn ${language === "pl" ? "landingLangActive" : ""}`}
              onClick={() => setLanguage("pl")}
            >
              PL
            </button>
          </div>
          <button className="loginBtn" onClick={goToLogin}>
            {l.login}
          </button>
          <button className="registerBtn" onClick={goToRegister}>
            {l.getStarted}
          </button>
        </div>
      </div>
      <div className="heroContainer">
        <img src={HeroImg} className="heroImg" id="home" />
        <div className="heroP">
          <h1 className="heroLine1">{l.heroLine1}</h1>
          <h1 className="heroLine2">{l.heroLine2}</h1>
          <p>{l.heroDesc}</p>
          <button className="registerBtn2" onClick={goToRegister}>
            {l.startTracking}
          </button>
        </div>
      </div>
      <div className="statisticContainer">
        <div className="statistic">
          <div className="stat">
            <div className="textInside">
              <p className="statTop">{l.stat1Top}</p>
              <p className="statBot">{l.stat1Bot}</p>
            </div>
          </div>
          <div className="stat">
            <div className="textInside">
              <p className="statTop">{l.stat2Top}</p>
              <p className="statBot">{l.stat2Bot}</p>
            </div>
          </div>
          <div className="stat">
            <div className="textInside">
              <p className="statTop">{l.stat3Top}</p>
              <p className="statBot">{l.stat3Bot}</p>
            </div>
          </div>
          <div className="stat">
            <div className="textInside">
              <p className="statTop">{l.stat4Top}</p>
              <p className="statBot">{l.stat4Bot}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="backgroundContainer">
        <div className="aboutUs">
          <div className="aboutLeft">
            <p className="aboutTop" id="about">
              {l.aboutTop}
            </p>
            <p className="aboutBot">{l.aboutBot}</p>
          </div>
          <div className="aboutRight">
            <img src={AboutUsImg} draggable={false} />
          </div>
        </div>
        <div className="features">
          <p id="features">{l.featuresTagline}</p>
          <div className="cardContainer">
            <div className="card">
              <div className="cardContent">
                <img src={Files} draggable={false} />
                <p className="cardTop">{l.card1Title}</p>
                <p className="cardBot">{l.card1Desc}</p>
              </div>
            </div>
            <div className="card">
              <div className="cardContent">
                <img src={Cloud} draggable={false} />
                <p className="cardTop">{l.card2Title}</p>
                <p className="cardBot">{l.card2Desc}</p>
              </div>
            </div>
            <div className="card">
              <div className="cardContent">
                <img src={Trends} draggable={false} />
                <p className="cardTop">{l.card3Title}</p>
                <p className="cardBot">{l.card3Desc}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="howItWork">
          <p id="howItWork">{l.howTitle}</p>
          <div className="steps">
            <div className="step step1">
              <div className="circle">1</div>
              <div className="circleP">
                <p className="circleTitle">{l.step1Title}</p>
                <p className="circleDesc">{l.step1Desc}</p>
              </div>
            </div>
            <img src={Line1} className="line line1" draggable={false} />
            <div className="step step2">
              <div className="circle">2</div>
              <div className="circleP">
                <p className="circleTitle">{l.step2Title}</p>
                <p className="circleDesc">{l.step2Desc}</p>
              </div>
            </div>
            <img src={Line2} className="line line2" draggable={false} />
            <div className="step step3">
              <div className="circle">3</div>
              <div className="circleP">
                <p className="circleTitle">{l.step3Title}</p>
                <p className="circleDesc">{l.step3Desc}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <p>{l.footerRights}</p>
          <div className="footerLinks">
            <a href="#home" className="link">
              <p className="underlineLink">{l.navHome}</p>
            </a>
            <a href="#about" className="link">
              <p className="underlineLink">{l.navAbout}</p>
            </a>
            <a href="#features" className="link">
              <p className="underlineLink">{l.navFeatures}</p>
            </a>
            <a href="#howItWork" className="link">
              <p className="underlineLink">{l.navHowItWorks}</p>
            </a>
            <a href="https://www.otomoto.pl/osobowe/polonez" className="link">
              <p className="underlineLink">{l.privacyPolicy}</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
