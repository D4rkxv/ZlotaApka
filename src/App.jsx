import "./App.css";
import { AuthProvider, useAuthLayout } from "./AuthContext.jsx";
import { DashboardProvider, useDashboard } from "./DashboardContext.jsx";
import AuthenticatedApp from "./AuthenticatedApp.jsx";
import GuestApp from "./GuestApp.jsx";
function App() {
  return (
    <AuthProvider>
      <div className="app">
        {true ? (
          <DashboardProvider>
            <AuthenticatedApp />
          </DashboardProvider>
        ) : (
          <GuestApp />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
