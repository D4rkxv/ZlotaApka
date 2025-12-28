import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
function SleepTracker() {
  return (
    <div className="sleepContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p>TESTSLEEP</p>
      </div>
    </div>
  );
}
export default SleepTracker;
