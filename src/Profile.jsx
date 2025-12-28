import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
function Profile() {
  return (
    <div className="profileContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p>PROFILETEST</p>
      </div>
    </div>
  );
}
export default Profile;
