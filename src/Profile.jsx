import React, { useState, useEffect, useContext, useRef} from "react";
import Sidebar from "./Sidebar.jsx";
import "./App.css";
import "./Profile.css";
import mountains from "./assets/Mountains.png";
import profilePic from "./assets/BigProfilePic.png";
import { useDashboard } from "./DashboardContext.jsx";
import { AuthContext } from "./AuthContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";
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
    saveNewProfileImage,
    saveMetrics,
    saveGoals,
  } = useDashboard();
  const {
    user,
    setName
  } = useContext(AuthContext)
  const { t } = useLanguage();
  const p = t.profile;
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

const saveProfileChanges = async () => {
  if (!newName) return;
  await setName(newName, selectedImageFile);
  if (selectedImageFile) {
    saveNewProfileImage(selectedImageFile);
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

const saveNewMetrics = async () => {
  if(!newHeight || !newWeight) return;
  await saveMetrics(newHeight, newWeight);
  setModifyingMetrics(false);
}
const cancelModifyingMetrics = () =>{
  setModifyingMetrics(false)
  setNewHeight(currentHeight)
  setNewWeight(currentWeight)
}

const writeGoal = () =>{
  if(currentWeight < goalWeight) return `${p.gain} ${goalWeight-currentWeight} ${p.kilos}`
  else if(currentWeight > goalWeight) return `${p.lose} ${currentWeight-goalWeight} ${p.kilos}`
  else return `${p.maintain} ${goalWeight} ${p.kilos}`
}

const cancelModifyingGoals = () =>{
  setModifyingGoals(false)
  setNewGoalWeight(goalWeight)
  setNewWaterGoal(hydrationGoal*1000)
  setNewActivityGoal(dailyActivity)
}

const saveNewGoals = async () => {
  if(!newGoalWeight || !newWaterGoal || !newActivityGoal) return;
  await saveGoals(newGoalWeight, parseFloat(newWaterGoal), parseInt(newActivityGoal));
  setModifyingGoals(false);
};

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
                  <p className="userGoals">{p.goalLabel} {writeGoal()} • {p.intermediate} </p>
                </div>
                {modifyingProfile ? 
                <div className="profileEditActions">
                  <p className="profileEdit" onClick={() => cancelProfileModification()}>{p.cancel}</p>
                  <p className="profileEdit" onClick={() => saveProfileChanges()}>{p.save}</p>
                </div> : 
                <p className="profileEdit" onClick={() => setModifyingProfile(true)}>{p.editProfile}</p>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="botProfileSection">
          <div className="botWidgetContainers">
            <div className="bodyMetricData">
              <div className="topMetric">
                <p className="sectionTitle">{p.bodyMetrics}</p>
                {!modifyingMetrics ? <p className="editWidget" onClick={()=>setModifyingMetrics(true)}>{p.editMetrics}</p>: <div className="editWidgetContainer">
                  <p className="editWidget" onClick={()=>cancelModifyingMetrics()}>{p.cancel}</p>
                  <p className="editWidget" onClick={()=>saveNewMetrics()}>{p.save}</p>
                  </div>}
              </div>
              <div className="metricItem">
                <p>{p.height}</p>
                {modifyingMetrics ? <input type="number" value={newHeight} className="modification" onChange={(e)=>setNewHeight(parseInt(e.target.value))} />:<p>{currentHeight}cm</p>}
              </div>
              <hr />
              <div className="metricItem">
                <p>{p.weight}</p>
                {modifyingMetrics ? <input type="number" value={newWeight} className="modification" onChange={(e)=>setNewWeight(parseInt(e.target.value))} />:<p>{currentWeight}kg</p>}
              </div>
              <hr />
              <div className="metricItem">
                <p>{p.age}</p>
                <p>{currentAge}</p>
              </div>
              <hr />
              <div className="metricItem">
                <p>{p.sex}</p>
                <p>{gender}</p>
              </div>
              <hr />
            </div>
            <div className="bodyGoals">
              <div className="topMetric">
                <p>{p.goalWeight}</p>
                {!modifyingGoals ? <p className="editWidget" onClick={()=>setModifyingGoals(true)}>{p.editGoals}</p>: 
                  <div className="editWidgetContainer">
                    <p className="editWidget" onClick={()=>cancelModifyingGoals()}>{p.cancel}</p>
                    <p className="editWidget" onClick={()=>saveNewGoals()}>{p.save}</p>
                  </div>
                }
              </div>
              <div className="goalItem">
                {modifyingGoals ? 
                <div className="goalEditionContainer">
                  <label htmlFor="activityGoal">{p.dailyActivity} </label>
                  <input type="number" id="activityGoal" className="modification" value={newActivityGoal} onChange={(e)=>setNewActivityGoal(parseInt(e.target.value))}  />
                  <label htmlFor="activityGoal"> {p.min} </label>
                </div>:
                <p>
                  {p.dailyActivity} {(allSeconds / 60).toFixed(1)} / {dailyActivity}{p.min}
                </p>
                }
                <div className="progressTrack progressTrackProfile">
                  <div className="progressFill" style={{width: `${(((allSeconds/60).toFixed(1) / dailyActivity) * 100).toFixed(1)}%`}}/>
                </div>
              </div>

              <div className="goalItem">
                {modifyingGoals ? 
                <div className="goalEditionContainer">
                  <label htmlFor="waterGoal">{p.dailyWater} </label>
                  <input type="number" id="waterGoal" className="modification" value={newWaterGoal} onChange={(e)=>setNewWaterGoal(parseFloat(e.target.value))}  />
                  <label htmlFor="waterGoal"> {p.litres} </label>
                </div>:
                <p>
                  {p.dailyWater} {currentHydration.toFixed(1)} {p.litres} / {(hydrationGoal * 1).toFixed(1)} {p.litres}
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
                  <label htmlFor="weightGoal">{p.weightGoal} </label>
                  <input type="number" id="weightGoal" className="modification" value={newGoalWeight} onChange={(e)=>setNewGoalWeight(parseInt(e.target.value))}  />
                  <label htmlFor="weightGoal"> {p.kg} </label>
                </div>:
                <p>
                  {currentWeight !== goalWeight ? <>{p.weightGoal} {getPercentOfWeightGoalCompletion()}% {currentWeight<goalWeight ? p.weightGainDone : p.weightLossDone} | {p.target} {goalWeight}kg</>:<>{p.weightGoal} {p.onGoal} {goalWeight}kg</>}
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
