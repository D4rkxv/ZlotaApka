import "./App.css";
import { useAuthLayout } from "./AuthContext.jsx";
import LandingRouter from "./LandingRouter.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";

function GuestApp() {
  const { currentPage } = useAuthLayout();

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingRouter />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      default:
        return <LandingRouter />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default GuestApp;
