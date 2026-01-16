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
    hydrationGoal,
    setHydrationGoal,
    dailyActivity,
    setDailyActivity,
    currentWeight,
    setCurrentWeight,
    goalWeight,
    setGoalWeight,
    gender,
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
  const [modifyingGoals, setModifyingGoals] = useState(false)
  const [newGoalWeight, setNewGoalWeight] = useState(goalWeight)
  const [newWaterGoal, setNewWaterGoal] = useState(hydrationGoal)
  const [newActivityGoal, setNewActivityGoal] = useState(dailyActivity)

  const fileInputRef = useRef(null);



  const cancelProfileModification = () => {
  setModifyingProfile(false);
  setNewName(user.name);
  setTempProfileImage(null);
  setSelectedImageFile(null);
};

  const saveProfileChanges = () => {
  if(!newName) return;
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

const saveNewMetrics = () =>{
  if(!newHeight || !newWeight) return;
  setCurrentHeight(newHeight)
  setCurrentWeight(newWeight)
  setModifyingMetrics(false)
}
const cancelModifyingMetrics = () =>{
  setModifyingMetrics(false)
  setNewHeight(currentHeight)
  setNewWeight(currentWeight)
}

const writeGoal = () =>{
  if(currentWeight < goalWeight) return `Gain ${goalWeight-currentWeight} kilos`
  else if(currentWeight > goalWeight) return `Lose ${currentWeight-goalWeight} kilos`
  else return `Maintain weight of ${goalWeight} kilos`
}

const cancelModifyingGoals = () =>{
  setModifyingGoals(false)
  setNewGoalWeight(goalWeight)
  setNewWaterGoal(hydrationGoal*1000)
  setNewActivityGoal(dailyActivity)
}

const saveNewGoals = () =>{
  if(!newGoalWeight || !newWaterGoal || !newActivityGoal) return;
  setGoalWeight(newGoalWeight)
  setHydrationGoal((newWaterGoal*1).toFixed(1))
  setDailyActivity(newActivityGoal)
  setModifyingGoals(false)
}

const getPercentOfWeightGoalCompletion = () =>{
  if(currentWeight < goalWeight){
    return ((currentWeight / goalWeight) * 100).toFixed(2)
  }
  else {
    return ((goalWeight / currentWeight) * 100).toFixed(2)
  }
}

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
                  </div>
                  <p className="userGoals">Goal: {writeGoal()} • Intermediate </p>
                </div>
                {modifyingProfile ? 
                <div className="profileEditActions">
                  <p className="profileEdit" onClick={() => cancelProfileModification()}>Cancel</p>
                  <p className="profileEdit" onClick={() => saveProfileChanges()}>Save</p>
                </div> : 
                <p className="profileEdit" onClick={() => setModifyingProfile(true)}>Edit Profile</p>
                }
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
                  <p className="editWidget" onClick={()=>cancelModifyingMetrics()}>Cancel</p>
                  <p className="editWidget" onClick={()=>saveNewMetrics()}>Save</p>
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
            </div>
            <div className="bodyGoals">
              <div className="topMetric">
                <p>Goal Weight</p>
                {!modifyingGoals ? <p className="editWidget" onClick={()=>setModifyingGoals(true)}>Edit Goals</p>: 
                  <div className="editWidgetContainer">
                    <p className="editWidget" onClick={()=>cancelModifyingGoals()}>Cancel</p>
                    <p className="editWidget" onClick={()=>saveNewGoals()}>Save</p>
                  </div>
                }
              </div>
              <div className="goalItem">
                {modifyingGoals ? 
                <div className="goalEditionContainer">
                  <label htmlFor="activityGoal">Daily activity time • </label>
                  <input type="number" id="activityGoal" className="modification" value={newActivityGoal} onChange={(e)=>setNewActivityGoal(parseInt(e.target.value))}  />
                  <label htmlFor="activityGoal"> min </label>
                </div>:
                <p>
                  Daily activity time • {(allSeconds / 60).toFixed(1)} / {dailyActivity}min
                </p>
                }
                
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" style={{width: `${(((allSeconds/60).toFixed(1) / dailyActivity) * 100).toFixed(1)}%`}}/>
                </div>
              </div>

              <div className="goalItem">
                {modifyingGoals ? 
                <div className="goalEditionContainer">
                  <label htmlFor="waterGoal">Daily water intake • </label>
                  <input type="number" id="waterGoal" className="modification" value={newWaterGoal} onChange={(e)=>setNewWaterGoal(parseFloat(e.target.value))}  />
                  <label htmlFor="waterGoal"> L </label>
                </div>:
                <p>
                  Daily water intake • {currentHydration.toFixed(1)} L / {(hydrationGoal * 1).toFixed(1)} L
                </p>
                }
                <div className="progressTrack progressTrackProfile">
                  <div
                    className="progressFill"
                    style={{ width: `${waterProgressWidth}%` }}
                  />
                </div>
              </div>

              <div className="goalItem">
                {modifyingGoals ? 
                <div className="goalEditionContainer">
                  <label htmlFor="weightGoal">Weight Goal • </label>
                  <input type="number" id="weightGoal" className="modification" value={newGoalWeight} onChange={(e)=>setNewGoalWeight(parseInt(e.target.value))}  />
                  <label htmlFor="weightGoal"> kg </label>
                </div>:
                <p>
                  {currentWeight !== goalWeight ? <>Weight Goal • {getPercentOfWeightGoalCompletion()}% {currentWeight<goalWeight ? "of weight gain done":"of weight loss done"} | Target: {goalWeight}kg</>:<>Weight Goal • You are right on your goal of {goalWeight}kg</>}
                </p>
                }
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" style={{width: `${getPercentOfWeightGoalCompletion()}%`}} />
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
