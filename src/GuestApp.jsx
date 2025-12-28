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
function GuestApp() {
  const { currentPage } = useAuthLayout();

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      default:
        return <LandingPage />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default GuestApp;
