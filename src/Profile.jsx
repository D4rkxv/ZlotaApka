import React, { useState, useEffect, useContext, useRef} from "react";
import Sidebar from "./Sidebar.jsx";
import "./App.css";
import "./Profile.css";
import mountains from "./assets/Mountains.png";
import profilePic from "./assets/BigProfilePic.png";
import { useDashboard } from "./DashboardContext.jsx";
import { AuthContext } from "./AuthContext.jsx";
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
    profileImage,
    saveNewProfileImage
  } = useDashboard();
  const {
    user,
    setName
  } = useContext(AuthContext)
  const [modifyingProfile, setModifyingProfile] = useState(false)
  const [newName, setNewName] = useState(user.name)
  const [tempProfileImage, setTempProfileImage] = useState(null); 
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [modifyingMetrics, setModifyingMetrics] = useState(false)
  const [newHeight, setNewHeight] = useState(currentHeight)
  const [newWeight, setNewWeight] = useState(currentWeight)
  const [newAge, setNewAge] = useState(currentAge)
  const [newGender, setNewGender] = useState(gender)
  const [newGoalWeight, setNewGoalWeight] = useState(goalWeight)

  const fileInputRef = useRef(null);



  const cancelProfileModification = () => {
  setModifyingProfile(false);
  setNewName(user.name);
  setTempProfileImage(null);
  setSelectedImageFile(null);
};

  const saveProfileChanges = () => {
  setName(newName);

  if (tempProfileImage) {
    saveNewProfileImage(selectedImageFile)
  }

  setTempProfileImage(null);
  setSelectedImageFile(null);
  setModifyingProfile(false);
};


  const handleImageClick = () => {
  if (modifyingProfile) {
    fileInputRef.current.click();
  }
};
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedImageFile(file);
  setTempProfileImage(URL.createObjectURL(file));
};

  return (
    <div className="widgetContainer2 profile">
      <Sidebar />
      <div className="allProfileSectionContainer">
        <div className="topProfileSection">
          <div className="profileContainer">
            <img src={mountains} className="mountainImg" />
            <div className="userData">
              <img
                src={tempProfileImage || profileImage}
                className={modifyingProfile ? "bigProfilePic activeImg" : "bigProfilePic"}
                onClick={handleImageClick}
                style={{ cursor: modifyingProfile ? "pointer" : "default" }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <div className="editProfileContainer">
                <div className="userDataContainer">
                  <div className="editNameContainer">
                    {!modifyingProfile ? <input type="text" value={user.name} disabled/>:<input type="text" value={newName} className="modification" onChange={(e)=>setNewName(e.target.value)} />}
                    {modifyingProfile ? <button className="emptyBtn" onClick={()=>cancelProfileModification()}>Close</button>:null}
                    {modifyingProfile ? <button className="fullBtn" onClick={()=>saveProfileChanges()}>Save</button>:null}
                  </div>
                  <p className="userGoals">Goal: gain 5k • Intermediate </p>
                </div>
                <p className="profileEdit" onClick={()=>setModifyingProfile(true)}>Edit Profile</p>
              </div>
            </div>
          </div>
        </div>
        <div className="botProfileSection">
          <div className="botWidgetContainers">
            <div className="bodyMetricData">
              <div className="topMetric">
                <p className="sectionTitle">Body & Metrics</p>
                {!modifyingMetrics ? <p className="editWidget" onClick={()=>setModifyingMetrics(true)}>Edit Metrics</p>: <div className="editWidgetContainer">
                  <p className="editWidget" onClick={()=>setModifyingMetrics(false)}>Cancel</p>
                  <p className="editWidget">Save</p>
                  </div>}
              </div>
              <div className="metricItem">
                <p>Height</p>
                {modifyingMetrics ? <input type="number" value={newHeight} className="modification" onChange={(e)=>setNewHeight(parseInt(e.target.value))} />:<p>{currentHeight}cm</p>}
              </div>
              <hr />
              <div className="metricItem">
                <p>Weight</p>
                {modifyingMetrics ? <input type="number" value={newWeight} className="modification" onChange={(e)=>setNewWeight(parseInt(e.target.value))} />:<p>{currentWeight}kg</p>}
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
                  Daily activity time • {(allSeconds / 60).toFixed(1)} / {dailyActivity}min
                </p>
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" style={{width: `${(((allSeconds/60).toFixed(1) / dailyActivity) * 100).toFixed(1)}%`}}/>
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
                  Weight Goal • {((currentWeight / goalWeight) * 100).toFixed(2)}% to target
                </p>
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" style={{width: `${((currentWeight / goalWeight) * 100).toFixed(2)}%`}} />
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
