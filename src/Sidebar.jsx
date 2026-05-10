import React, { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "./AuthContext.jsx";
import "./Sidebar.css";
import Logo from "./assets/Ellipse4.png";
import "./LoginPage.css";
import dashboard from "./assets/dashboard.svg";
import water from "./assets/water.svg";
import food from "./assets/food.svg";
import workout from "./assets/workouts.svg";
import sleep from "./assets/sleep.svg";
import help from "./assets/help.svg";
import arrowUp from "./assets/arrow.svg";
import { useDashboard } from "./DashboardContext.jsx";
import profile from "./assets/profile.svg";
import settings from "./assets/settings.svg";
import logoutImg from "./assets/logout.svg";
import { useAuthLayout } from "./AuthContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";


function Sidebar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const accountCardRef = useRef(null);
  const { t } = useLanguage();
  const s = t.sidebar;

  const isTablet = windowWidth > 768 && windowWidth <= 1200;
  const isMobile = windowWidth <= 768;

  const {
    goToDashboard,
    goToWater,
    goToFood,
    goToWorkouts,
    goToSleep,
    goToProfile,
    goToSettings,
    goToHelp,
    selectedWidget,
    profileImage,
  } = useDashboard();
  const { user } = useContext(AuthContext);
  const { logout } = useAuthLayout();

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w > 768) setMobileOpen(false);
      setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        accountCardRef.current &&
        !accountCardRef.current.contains(e.target)
      ) {
        const portal = document.getElementById("account-popup-portal");
        if (portal && portal.contains(e.target)) return;
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

      const handleAccountCardClick = () => {
    if (isTablet && accountCardRef.current) {
      const rect = accountCardRef.current.getBoundingClientRect();
      setPopupPos({
        bottom: window.innerHeight - rect.bottom,
        left: 88,
      });
    }
    setOpen((prev) => !prev);
  };

  const closeMobile = () => setMobileOpen(false);
  const handleNav = (fn) => {
    fn();
    closeMobile();
  };

  const handleProfileClick = () => {
    goToProfile();
    setOpen(false);
    closeMobile();
  };
  const handleSettingsClick = () => {
    goToSettings();
    setOpen(false);
    closeMobile();
  };
  const handleLogoutClick = () => {
    logout();
    setOpen(false);
    closeMobile();
  };
  const handleHelpClick = () => {
    goToHelp();
    setOpen(false);
    closeMobile();
  };
  const TabletPopup = () =>
    isTablet && open
      ? createPortal(
          <div
            id="account-popup-portal"
            style={{
              position: "fixed",
              bottom: popupPos.bottom,
              left: popupPos.left,
              zIndex: 9999,
              background: "var(--pureWhite)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(15, 23, 42, 0.15)",
              padding: "12px",
              minWidth: "210px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              className="accountItem"
              onClick={(e) => {
                e.stopPropagation();
                handleProfileClick();
              }}
            >
              <img src={profile} alt="" width={24} height={24} />
              <p style={{ margin: 0, fontSize: 16, color: "var(--textColor)" }}>{s.profile}</p>
            </div>
            <div
              className="accountItem"
              onClick={(e) => {
                e.stopPropagation();
                handleSettingsClick();
              }}
            >
              <img src={settings} alt="" width={24} height={24} />
              <p style={{ margin: 0, fontSize: 16, color: "var(--textColor)" }}>{s.settings}</p>
            </div>
            <div
              className="accountItem"
              onClick={(e) => {
                e.stopPropagation();
                handleLogoutClick();
              }}
            >
              <img src={logoutImg} alt="" width={24} height={24} />
              <p style={{ margin: 0, fontSize: 16, color: "var(--textColor)" }}>{s.logout}</p>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        className={`hamburgerBtn ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className="hamburgerBar" />
        <span className="hamburgerBar" />
        <span className="hamburgerBar" />
      </button>

      <div
        className={`mobileOverlay ${mobileOpen ? "visible" : ""}`}
        onClick={closeMobile}
      />

      <div className={`sidebar ${mobileOpen ? "mobileOpen" : ""}`}>
        <div className="topSidebarSection">
          <div
            className="vitaLogoDashboard"
            onClick={() => handleNav(goToDashboard)}
          >
            <img src={Logo} className="navbarLogo" draggable={false} />
            <p className="dashboardSidebarTitle">
              <span className="logoName">VitaTrack</span>
            </p>
          </div>
        </div>

        <div className="midSidebarSection">
          <div className="linksContainer">
            <div
              className={`dashboardSidebarContainer ${selectedWidget === "dashboard" ? "selected" : ""}`}
              onClick={() => handleNav(goToDashboard)}
            >
              <img src={dashboard} alt="Dashboard" width={24} height={24} title="Dashboard" style={{ display: "block" }} />
              <p>{s.dashboard}</p>
            </div>
            <div
              className={`waterSidebarContainer ${selectedWidget === "water" ? "selected" : ""}`}
              onClick={() => handleNav(goToWater)}
            >
              <img src={water} alt="Water" width={24} height={24} title="Water" style={{ display: "block" }} />
              <p>{s.water}</p>
            </div>
            <div
              className={`foodSidebarContainer ${selectedWidget === "food" ? "selected" : ""}`}
              onClick={() => handleNav(goToFood)}
            >
              <img src={food} alt="Food Diary" width={24} height={24} title="Food Diary" style={{ display: "block" }} />
              <p>{s.foodDiary}</p>
            </div>
            <div
              className={`workoutSidebarContainer ${selectedWidget === "workouts" ? "selected" : ""}`}
              onClick={() => handleNav(goToWorkouts)}
            >
              <img src={workout} alt="Workouts" width={24} height={24} title="Workouts" style={{ display: "block" }} />
              <p>{s.workouts}</p>
            </div>
            <div
              className={`sleepSidebarContainer ${selectedWidget === "sleep" ? "selected" : ""}`}
              onClick={() => handleNav(goToSleep)}
            >
              <img src={sleep} alt="Sleep Tracker" width={24} height={24} title="Sleep Tracker" style={{ display: "block" }} />
              <p>{s.sleepTracker}</p>
            </div>
          </div>
        </div>

        <div className="botSidebarSection">
          <div
            className="helpSidebarContainer"
            onClick={(e) => {
              e.stopPropagation();
              handleHelpClick();
            }}
          >
            <img src={help} alt="Help" width={24} height={24} title="Help" style={{ display: "block" }} />
            <p>{s.help}</p>
          </div>

          <div
            ref={accountCardRef}
            className={`accountCard ${open && !isTablet ? "open" : ""}`}
            onClick={handleAccountCardClick}
          >
            <div className="accountHeader">
              <div className="leftAccountSide">
                <img
                  src={profileImage}
                  className="profilePicture"
                  alt="Profile"
                />
              </div>
              <div className="middleAccountSide">
                <p className="sidebarName">{user.name}</p>
                <p className="sidebarEmail">{user.email}</p>
              </div>
              <div className="rightAccountSide">
                <img src={arrowUp} className="arrowCard" alt="" />
              </div>
            </div>
            {!isTablet && (
              <div className="accountMenu">
                <div
                  className="accountItem"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfileClick();
                  }}
                >
                  <img src={profile} alt="" />
                  <p>{s.profile}</p>
                </div>
                <div
                  className="accountItem"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSettingsClick();
                  }}
                >
                  <img src={settings} alt="" />
                  <p>{s.settings}</p>
                </div>
                <div
                  className="accountItem"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogoutClick();
                  }}
                >
                  <img src={logoutImg} alt="" />
                  <p>{s.logout}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <TabletPopup />
    </>
  );
}

export default Sidebar;