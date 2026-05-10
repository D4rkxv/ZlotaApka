import "./App.css";
import { AuthProvider, useAuthLayout } from "./AuthContext.jsx";
import { DashboardProvider } from "./DashboardContext.jsx";
import AuthenticatedApp from "./AuthenticatedApp.jsx";
import GuestApp from "./GuestApp.jsx";
import { LanguageProvider } from "./LanguageContext.jsx";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="app">
          <AuthStatus>
            {({ isAuthenticated }) =>
              isAuthenticated ? (
                <DashboardProvider>
                  <AuthenticatedApp />
                </DashboardProvider>
              ) : (
                <GuestApp />
              )
            }
          </AuthStatus>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

function AuthStatus({ children }) {
  const { isAuthenticated } = useAuthLayout();
  return children({ isAuthenticated });
}
export default App;
