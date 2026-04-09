import "./App.css";
import LandingPage from "./LandingPage.jsx";
import { Routes, Route, Link } from "react-router";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import Login from "./LoginPage.jsx";
import { useAuthLayout } from "./AuthContext.jsx";
import { useDashboard } from "./DashboardContext.jsx";
import Dashboard from "./Dashboard.jsx";
import WaterTracker from "./WaterManagement.jsx";
import FoodDiary from "./FoodDiary.jsx";
import Workouts from "./Workouts.jsx";
import SleepTracker from "./SleepTracker.jsx";
import Profile from "./Profile.jsx";
import Settings from "./Settings.jsx";
import Help from "./Help.jsx";

function AuthenticatedApp() {
  const { selectedWidget } = useDashboard();
  const renderWidget = () => {
    switch (selectedWidget) {
      case "dashboard":
        return <Dashboard />;
      case "water":
        return <WaterTracker />;
      case "food":
        return <FoodDiary />;
      case "workouts":
        return <Workouts />;
      case "sleep":
        return <SleepTracker />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "help":
        return <Help />;
      default:
        return <Dashboard />;
    }
  };
  return <div className="app">{renderWidget()}</div>;
}

export default AuthenticatedApp;
