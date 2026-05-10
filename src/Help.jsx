import React from "react";
import Sidebar from "./Sidebar.jsx";
import "./Help.css";
import { useLanguage } from "./LanguageContext.jsx";

function Help() {
  const { t } = useLanguage();
  return (
    <div className="helpContainer">
      <Sidebar />
      <div className="helpContent">
        <p className="siteTitle">{t.help.title}</p>
        <div className="helpCard">
          <p className="helpCardTitle">Need support?</p>
          <p className="helpCardText">
            If you need help, send an email to:{" "}
            <a href="mailto:exampleemail@example.com" className="helpMail">
              exampleemail@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Help;