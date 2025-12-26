import "./App.css";
import LandingPage from "./LandingPage.jsx";
import { Routes, Route, Link } from "react-router";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import Login from "./LoginPage.jsx";
import { useAuthLayout } from "./AuthContext.jsx";

function App() {
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

export default App;
