import "./App.css";
import { useAuthLayout } from "./AuthContext.jsx";
import LandingPage from "./LandingPage.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";

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
