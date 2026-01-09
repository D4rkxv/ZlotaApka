import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import "./App.css";
import "./Profile.css";
import mountains from "./assets/Mountains.png";
import profilePic from "./assets/BigProfilePic.png";
import { useDashboard } from "./DashboardContext.jsx";
function Profile() {
  const {
    currentHydration,
    setCurrentHydration,
    hydrationGoal,
    setHydrationGoal,
    sleepTimeInput,
    setSleepTimeInput,
    sleepTime,
    setSleepTime,
    caloriesGoal,
    setCaloriesGoal,
    dailyActivity,
    setDailyActivity,
    weeklyWorkouts,
    setWeeklyWorkouts,
    currentWeight,
    setCurrentWeight,
    goalWeight,
    setGoalWeight,
    gender,
    setGender,
    currentHeight,
    setCurrentHeight,
    currentAge,
    waterProgressWidth,
    allSeconds,
  } = useDashboard();
  return (
    <div className="widgetContainer2">
      <Sidebar />
      <div className="allProfileSectionContainer">
        <div className="topProfileSection">
          <div className="profileContainer">
            <img src={mountains} className="mountainImg" />

            <div className="userData">
              <img src={profilePic} className="bigProfilePic" />
              <div className="editProfileContainer">
                <div className="userDataContainer">
                  <p className="userName">Jan kowalski</p>
                  <p className="userGoals">Goal: gain 5k • Intermediate </p>
                </div>
                <p className="profileEdit">Edit Profile</p>
              </div>
            </div>
          </div>
        </div>
        <div className="botProfileSection">
          <div className="botWidgetContainers">
            <div className="bodyMetricData">
              <div className="topMetric">
                <p className="sectionTitle">Body & Metrics</p>
                <p className="editWidget">Edit Profile</p>
              </div>
              <div className="metricItem">
                <p>Height</p>
                <p>{currentHeight}cm</p>
              </div>
              <hr />
              <div className="metricItem">
                <p>Weight</p>
                <p>{currentWeight}kg</p>
              </div>
              <hr />
              <div className="metricItem">
                <p>Age</p>
                <p>{currentAge}</p>
              </div>
              <hr />
              <div className="metricItem">
                <p>Sex</p>
                <p>{gender}</p>
              </div>
              <hr />
              <div className="metricItem">
                <p>Goal Weight</p>
                <p>{goalWeight}kg</p>
              </div>
            </div>
            <div className="bodyGoals">
              <div className="topMetric">
                <p className="sectionTitle">Goals</p>
                <p className="editWidget">Edit Goals</p>
              </div>
              <div className="goalItem">
                <p>
                  Daily activity time • {allSeconds / 60} / {dailyActivity}min
                </p>
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" />
                </div>
              </div>

              <div className="goalItem">
                <p>
                  Daily water intake {currentHydration.toFixed(1)} L /{" "}
                  {(hydrationGoal * 1).toFixed(1)} L
                </p>
                <div className="progressTrack progressTrackProfile">
                  <div
                    className="progressFill"
                    style={{ width: `${waterProgressWidth}%` }}
                  />
                </div>
              </div>

              <div className="goalItem">
                <p>
                  Weight Goal • {(currentWeight / goalWeight) * 100}% to target
                </p>
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
