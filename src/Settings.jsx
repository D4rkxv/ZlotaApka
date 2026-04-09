import React, { useState } from "react";
import "./Settings.css";
import Sidebar from "./Sidebar";
import { api } from "./AuthContext.jsx";

const Settings = () => {
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleClear = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć wszystkie dane?")) return;
    setResetting(true);
    try {
      await api.delete("/user/reset-data");
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error resetting data:", error);
      setResetting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć.",
      )
    )
      return;
    setDeleting(true);
    try {
      await api.delete("/user/delete-account");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleting(false);
    }
  };

  return (
    <div className="settingsContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">Settings</p>
        <div className="resetDataContainer">
          <div className="descriptionContainer">
            <p className="sectionTitle">Reset your data</p>
            <p className="sectionDescription">
              Delete all of your data, and start fresh!
            </p>
          </div>
          <div className="buttonContainer">
            <button
              className="resetDataButton"
              onClick={handleClear}
              disabled={resetting}
            >
              {resetting ? "Resetting..." : "Reset Data"}
            </button>
          </div>
        </div>
        <div className="deleteAccountContainer">
          <div className="descriptionContainer">
            <p className="sectionTitle">Delete your account</p>
            <p className="sectionDescription">
              Delete your account and all of your data permanently.
            </p>
          </div>
          <div className="buttonContainer">
            <button
              className="deleteAccountButton"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
