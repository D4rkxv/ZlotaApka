import React, { useState, useEffect, useContext } from "react";
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

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
              <img src={dashboard} alt="Dashboard" />
              <p>Dashboard</p>
            </div>
            <div
              className={`waterSidebarContainer ${selectedWidget === "water" ? "selected" : ""}`}
              onClick={() => handleNav(goToWater)}
            >
              <img src={water} alt="Water" />
              <p>Water</p>
            </div>
            <div
              className={`foodSidebarContainer ${selectedWidget === "food" ? "selected" : ""}`}
              onClick={() => handleNav(goToFood)}
            >
              <img src={food} alt="Food" />
              <p>Food Diary</p>
            </div>
            <div
              className={`workoutSidebarContainer ${selectedWidget === "workouts" ? "selected" : ""}`}
              onClick={() => handleNav(goToWorkouts)}
            >
              <img src={workout} alt="Workouts" />
              <p>Workouts</p>
            </div>
            <div
              className={`sleepSidebarContainer ${selectedWidget === "sleep" ? "selected" : ""}`}
              onClick={() => handleNav(goToSleep)}
            >
              <img src={sleep} alt="Sleep" />
              <p>Sleep Tracker</p>
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
            <img src={help} alt="Help" />
            <p>Help</p>
          </div>

          <div
            className={`accountCard ${open ? "open" : ""}`}
            onClick={() => setOpen((prev) => !prev)}
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
            <div className="accountMenu">
              <div
                className="accountItem"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProfileClick();
                }}
              >
                <img src={profile} alt="" />
                <p>Profile</p>
              </div>
              <div
                className="accountItem"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSettingsClick();
                }}
              >
                <img src={settings} alt="" />
                <p>Settings</p>
              </div>
              <div
                className="accountItem"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogoutClick();
                }}
              >
                <img src={logoutImg} alt="" />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
