import React, { useState } from "react";
import "./Settings.css";
import Sidebar from "./Sidebar";
import { api } from "./AuthContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleClear = async () => {
    if (!window.confirm(t.settings.confirmReset)) return;
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
    if (!window.confirm(t.settings.confirmDelete)) return;
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
    <div className="settingsContainer">
      <Sidebar />
      <div className="settingsContent">
        <p className="siteTitle">{t.settings.title}</p>

        {/* Language Section */}
        <div className="languageContainer">
          <div className="descriptionContainer">
            <p className="sectionTitle">{t.settings.languageTitle}</p>
            <p className="sectionDescription">{t.settings.languageDesc}</p>
          </div>
          <div className="languageBtnContainer">
            <button
              className={`langBtn ${language === "en" ? "langBtnActive" : ""}`}
              onClick={() => setLanguage("en")}
            >
              🇬🇧 English
            </button>
            <button
              className={`langBtn ${language === "pl" ? "langBtnActive" : ""}`}
              onClick={() => setLanguage("pl")}
            >
              🇵🇱 Polski
            </button>
          </div>
        </div>

        <div className="resetDataContainer">
          <div className="descriptionContainer">
            <p className="sectionTitle">{t.settings.resetDataTitle}</p>
            <p className="sectionDescription">{t.settings.resetDataDesc}</p>
          </div>
          <div className="buttonContainer">
            <button
              className="resetDataButton"
              onClick={handleClear}
              disabled={resetting}
            >
              {resetting ? t.settings.resettingBtn : t.settings.resetDataBtn}
            </button>
          </div>
        </div>

        <div className="deleteAccountContainer">
          <div className="descriptionContainer">
            <p className="sectionTitle">{t.settings.deleteAccountTitle}</p>
            <p className="sectionDescription">{t.settings.deleteAccountDesc}</p>
          </div>
          <div className="buttonContainer">
            <button
              className="deleteAccountButton"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? t.settings.deletingBtn : t.settings.deleteAccountBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;