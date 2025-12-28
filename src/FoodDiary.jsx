import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
function FoodDiary() {
  return (
    <div className="foodContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p>TESTFOOD</p>
      </div>
    </div>
  );
}
export default FoodDiary;
