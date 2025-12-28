import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
function Workouts() {
  return (
    <div className="workoutsContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p>TESTWORKOUTS</p>
      </div>
    </div>
  );
}
export default Workouts;
