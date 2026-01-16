import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";

import "./index.css";
import App from "./App.jsx";
import LandingPage from "./LandingPage.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import { Dashboard } from "./Dashboard.jsx";
import WaterManagement from "./WaterManagement.jsx";
import { DashboardProvider } from "./DashboardContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
