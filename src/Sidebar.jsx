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
import profilePic from "./assets/testprofile.png";
import { useDashboard } from "./DashboardContext.jsx";
import profile from "./assets/profile.svg";
import settings from "./assets/settings.svg";
import logoutImg from "./assets/logout.svg";
import { useAuthLayout } from "./AuthContext.jsx";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const {
    goToDashboard,
    goToWater,
    goToFood,
    goToWorkouts,
    goToSleep,
    goToProfile,
    goToSettings,
    selectedWidget,
  } = useDashboard();
  const { user } = useContext(AuthContext);
  const { logout, isAuthenticated } = useAuthLayout();
  const handleProfileClick = () => {
    goToProfile();
    setOpen(!open);
  };
  const handleSettingsClick = () => {
    goToSettings();
    setOpen(!open);
  };
  const handleLogoutClick = () => {
    logout();
    setOpen(false);
  };
  return (
    <div className="sidebar">
      <div className="topSidebarSection">
        <div className="vitaLogoDashboard" onClick={goToDashboard}>
          <img src={Logo} className="navbarLogo" draggable={false} />
          <p className="dashboardSidebarTitle">
            <a className="logoName">VitaTrack</a>
          </p>
        </div>

        <input
          type="search"
          name="dashboardSearch"
          className="dashboardSearch"
          placeholder={`Search`}
        />
      </div>
      <div className="midSidebarSection">
        <div className="linksContainer">
          <div
            className={`dashboardSidebarContainer ${
              selectedWidget === "dashboard" ? "selected" : ""
            }`}
            onClick={goToDashboard}
          >
            <img src={dashboard} />
            <p>Dashboard</p>
          </div>
          <div
            className={`waterSidebarContainer ${
              selectedWidget === "water" ? "selected" : ""
            }`}
            onClick={goToWater}
          >
            <img src={water} />
            <p>Water</p>
          </div>
          <div
            className={`foodSidebarContainer ${
              selectedWidget === "food" ? "selected" : ""
            }`}
            onClick={goToFood}
          >
            <img src={food} />
            <p>Food Diary</p>
          </div>
          <div
            className={`workoutSidebarContainer ${
              selectedWidget === "workouts" ? "selected" : ""
            }`}
            onClick={goToWorkouts}
          >
            <img src={workout} />
            <p>Workouts</p>
          </div>
          <div
            className={`sleepSidebarContainer ${
              selectedWidget === "sleep" ? "selected" : ""
            }`}
            onClick={goToSleep}
          >
            <img src={sleep} />
            <p>Sleep Tracker</p>
          </div>
        </div>
      </div>
      <div className="botSidebarSection">
        <div className="helpSidebarContainer">
          <img src={help} />
          <p>Help</p>
        </div>

        <div
          className={`accountCard ${open ? "open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="accountHeader">
            <div className="leftAccountSide">
              <img src={profilePic} className="profilePicture" />
            </div>
            <div className="middleAccountSide">
              <p className="sidebarName">{user.name}</p>
              <p className="sidebarEmail">{user.email}</p>
            </div>
            <div className="rightAccountSide">
              <img src={arrowUp} className="arrowCard" />
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
              <img src={profile} />
              <p>Profile</p>
            </div>

            <div
              className="accountItem"
              onClick={(e) => {
                e.stopPropagation();
                handleSettingsClick();
              }}
            >
              <img src={settings} />
              <p>Settings</p>
            </div>

            <div
              className="accountItem"
              onClick={(e) => {
                e.stopPropagation();
                handleLogoutClick();
              }}
            >
              <img src={logoutImg} />
              <p>Logout</p>
            </div>
          </div>
        </div>
      </div>
      {/* dropdown menu */}
    </div>
  );
}
export default Sidebar;
