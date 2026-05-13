import React, { useState } from "react";
import Logo from "./assets/logo.png";
import HeroImg from "./assets/Background.png";
import AboutUsImg from "./assets/Running.png";
import Files from "./assets/Files.png";
import Cloud from "./assets/Cloud.png";
import Trends from "./assets/Trends.png";
import "./MobileLandingPage.css";
import { useAuthLayout } from "./AuthContext";
import { useLanguage } from "./LanguageContext.jsx";

function MobileLandingPage() {
  const { goToLogin, goToRegister } = useAuthLayout();
  const { t, language, setLanguage } = useLanguage();
  const l = t.landing;
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="mobileNavbar">
        <div className="mobileVitaLogo">
          <img
            src={Logo}
            className="mobileNavLogo"
            draggable={false}
            alt="logo"
          />
          <span className="mobileLogoName">VitaTrack</span>
        </div>
        <button
          className="mobileHamburger"
          aria-label="Otwórz menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="mobileMenuOverlay">
          <button
            className="mobileMenuClose"
            aria-label="Zamknij menu"
            onClick={closeMenu}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="mobileMenuLinks">
            <a href="#home" className="mobileMenuLink" onClick={closeMenu}>
              {l.navHome}
            </a>
            <a href="#about" className="mobileMenuLink" onClick={closeMenu}>
              {l.navAbout}
            </a>
            <a href="#features" className="mobileMenuLink" onClick={closeMenu}>
              {l.navFeatures}
            </a>
            <a href="#howItWork" className="mobileMenuLink" onClick={closeMenu}>
              {l.navHowItWorks}
            </a>
          </div>

          <div className="mobileMenuDivider" />

          <div className="mobileLangSwitch">
            <button
              className={`mobileLangBtn ${language === "en" ? "mobileLangActive" : ""}`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <span className="mobileLangSep">|</span>
            <button
              className={`mobileLangBtn ${language === "pl" ? "mobileLangActive" : ""}`}
              onClick={() => setLanguage("pl")}
            >
              PL
            </button>
          </div>

          <div className="mobileMenuButtons">
            <button
              className="mobileMenuLoginBtn"
              onClick={() => {
                goToLogin();
                closeMenu();
              }}
            >
              {l.login}
            </button>
            <button
              className="mobileMenuRegisterBtn"
              onClick={() => {
                goToRegister();
                closeMenu();
              }}
            >
              {l.getStarted}
            </button>
          </div>
        </div>
      )}

      <div
        className="mobileHero"
        id="home"
        style={{ backgroundImage: `url(${HeroImg})` }}
      >
        <div className="mobileHeroOverlay" />
        <div className="mobileHeroCard">
          <h1 className="mobileHeroLine1">{l.heroLine1}</h1>
          <h1 className="mobileHeroLine2">{l.heroLine2}</h1>
          <p className="mobileHeroDesc">{l.heroDesc}</p>
          <button className="mobileHeroCta" onClick={goToRegister}>
            {l.startTracking}
          </button>
        </div>
      </div>

      <div className="mobileStats">
        <div className="mobileStatGrid">
          <div className="mobileStat">
            <p className="mobileStatTop">{l.stat1Top}</p>
            <p className="mobileStatBot">{l.stat1Bot}</p>
          </div>
          <div className="mobileStat">
            <p className="mobileStatTop">{l.stat2Top}</p>
            <p className="mobileStatBot">{l.stat2Bot}</p>
          </div>
          <div className="mobileStat">
            <p className="mobileStatTop">{l.stat3Top}</p>
            <p className="mobileStatBot">{l.stat3Bot}</p>
          </div>
          <div className="mobileStat">
            <p className="mobileStatTop">{l.stat4Top}</p>
            <p className="mobileStatBot">{l.stat4Bot}</p>
          </div>
        </div>
      </div>

      <div className="mobileBackgroundContainer">
        <div className="mobileAbout" id="about">
          <div className="mobileAboutContent">
            <p className="mobileAboutTop">{l.aboutTop}</p>
            <p className="mobileAboutBot">{l.aboutBot}</p>
            <div className="mobileAboutImgWrap">
              <img src={AboutUsImg} draggable={false} alt="About VitaTrack" />
            </div>
          </div>
        </div>

        <div className="mobileFeatures" id="features">
          <p className="mobileSectionTitle">{l.featuresTagline}</p>
          <div className="mobileCardList">
            <div className="mobileCard">
              <img
                src={Files}
                draggable={false}
                alt=""
                className="mobileCardIcon"
              />
              <p className="mobileCardTop">{l.card1Title}</p>
              <p className="mobileCardBot">{l.card1Desc}</p>
            </div>
            <div className="mobileCard">
              <img
                src={Cloud}
                draggable={false}
                alt=""
                className="mobileCardIcon"
              />
              <p className="mobileCardTop">{l.card2Title}</p>
              <p className="mobileCardBot">{l.card2Desc}</p>
            </div>
            <div className="mobileCard">
              <img
                src={Trends}
                draggable={false}
                alt=""
                className="mobileCardIcon"
              />
              <p className="mobileCardTop">{l.card3Title}</p>
              <p className="mobileCardBot">{l.card3Desc}</p>
            </div>
          </div>
        </div>

        <div className="mobileHowItWork" id="howItWork">
          <p className="mobileSectionTitle">{l.howTitle}</p>
          <div className="mobileSteps">
            <div className="mobileStepLine" />
            <div className="mobileStep">
              <div className="mobileCircle">1</div>
              <div className="mobileStepText">
                <p className="mobileCircleTitle">{l.step1Title}</p>
                <p className="mobileCircleDesc">{l.step1Desc}</p>
              </div>
            </div>
            <div className="mobileStep">
              <div className="mobileCircle">2</div>
              <div className="mobileStepText">
                <p className="mobileCircleTitle">{l.step2Title}</p>
                <p className="mobileCircleDesc">{l.step2Desc}</p>
              </div>
            </div>
            <div className="mobileStep">
              <div className="mobileCircle">3</div>
              <div className="mobileStepText">
                <p className="mobileCircleTitle">{l.step3Title}</p>
                <p className="mobileCircleDesc">{l.step3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mobileFooter">
          <p className="mobileFooterRights">{l.footerRights}</p>
          <div className="mobileFooterLinks">
            <a href="#home" className="mobileFooterLink">
              {l.navHome}
            </a>
            <a href="#about" className="mobileFooterLink">
              {l.navAbout}
            </a>
            <a href="#features" className="mobileFooterLink">
              {l.navFeatures}
            </a>
            <a href="#howItWork" className="mobileFooterLink">
              {l.navHowItWorks}
            </a>
            <a
              href="https://www.otomoto.pl/osobowe/polonez"
              className="mobileFooterLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.privacyPolicy}
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default MobileLandingPage;
