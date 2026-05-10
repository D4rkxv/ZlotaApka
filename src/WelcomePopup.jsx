import React, { useEffect, useState } from "react";
import "./Popups.css";
import { useDashboard } from "./DashboardContext";
import { useLanguage } from "./LanguageContext.jsx";

const WelcomePopup = ({ setPopupVisibility }) => {
  const {
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
    hydrationGoal,
    setHydrationGoal,
    currentHeight,
    setCurrentHeight,
    currentAge,
    setCurrentAge,
    saveProfileData,
  } = useDashboard();
  const { t } = useLanguage();
  const w = t.welcome;
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSleepTime([(sleepTimeInput / 60).toFixed(0), sleepTimeInput % 60]);
  }, [sleepTimeInput]);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentWeight || !goalWeight || !gender || !currentHeight || !currentAge) {
      alert(w.fillAllFields);
      return;
    }
    setIsSaving(true);
    const result = await saveProfileData();
    setIsSaving(false);
    if (result.success) {
      setPopupVisibility(false);
    } else {
      alert(w.errorSaving + " " + (result.error || w.unknownError));
    }
  };

  return (
    <div className="popupBackground">
      <div className="welcomePopup popupContainer">
        <form onSubmit={handleSaveProfile}>
          <p className="popupTitle">{w.title}</p>
          <p className="popupDescription">{w.description}</p>
          <div className="popupSection">
            <p className="popupSectionTitle">{w.yourDetails}</p>
            <div className="inputGroup">
              <input
                type="number"
                id="heightInput"
                value={currentHeight}
                onChange={(e) => setCurrentHeight(e.target.value)}
                required
                min={1}
              />
              <label>{w.currentHeight}</label>
            </div>
            <div className="inputGroup">
              <input
                type="number"
                id="weightInput"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                required
                min={1}
              />
              <label>{w.currentWeight}</label>
            </div>
            <div className="inputGroup">
              <input
                type="number"
                id="ageInput"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                required
                min={1}
              />
              <label>{w.currentAge}</label>
            </div>
            <div className="popupSubSection">
              <p>{w.gender}</p>
              <div className="divider">
                <div className="radioButtonContainer">
                  <input
                    type="radio"
                    name="gender"
                    id="maleGender"
                    value={"Male"}
                    onChange={handleGenderChange}
                    checked={gender === "Male"}
                  />
                  <label htmlFor="maleGender">{w.male}</label>
                </div>
                <div className="radioButtonContainer">
                  <input
                    type="radio"
                    name="gender"
                    id="femaleGender"
                    value={"Female"}
                    onChange={handleGenderChange}
                    checked={gender === "Female"}
                  />
                  <label htmlFor="femaleGender">{w.female}</label>
                </div>
              </div>
            </div>
          </div>
          <div className="popupSection">
            <p className="popupSectionTitle">{w.yourGoals}</p>
            <div className="inputGroup">
              <input
                type="number"
                id="goalWeightInput"
                min={1}
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                required
              />
              <label>{w.goalWeight}</label>
            </div>
            <p className="popupSubSection">
              {w.dailySleepGoal} {sleepTime[0]}h{" "}
              {sleepTime[1] > 0 ? `${sleepTime[1]}min` : null}
            </p>
            <div className="sliderContainer">
              <p>4h</p>
              <input
                type="range"
                name="sleepTimeInput"
                id="sleepTimeInput"
                min={240}
                max={600}
                value={sleepTimeInput}
                onChange={(e) => setSleepTimeInput(e.target.value)}
                required
              />
              <p>10h</p>
            </div>
            <p className="popupSubSection">
              {w.dailyCaloriesGoal} {caloriesGoal}kcal
            </p>
            <div className="sliderContainer">
              <p>1000kcal</p>
              <input
                type="range"
                name="caloriesGoalInput"
                id="caloriesGoalInput"
                min={1000}
                max={5000}
                value={caloriesGoal}
                onChange={(e) => setCaloriesGoal(e.target.value)}
                required
              />
              <p>5000kcal</p>
            </div>
            <p className="popupSubSection">
              {w.dailyActivity} {dailyActivity}min
            </p>
            <div className="sliderContainer">
              <p>10min</p>
              <input
                type="range"
                name="activityInput"
                id="activityInput"
                min={10}
                max={120}
                value={dailyActivity}
                onChange={(e) => setDailyActivity(e.target.value)}
                required
              />
              <p>120min</p>
            </div>
            <p className="popupSubSection">
              {w.weeklyWorkouts} {weeklyWorkouts}
            </p>
            <div className="sliderContainer">
              <p>1</p>
              <input
                type="range"
                name="activityInput"
                id="activityInput"
                min={1}
                max={7}
                value={weeklyWorkouts}
                onChange={(e) => setWeeklyWorkouts(e.target.value)}
                required
              />
              <p>7</p>
            </div>
            <p className="popupSubSection">{w.dailyWater} {hydrationGoal}</p>
            <div className="sliderContainer">
              <p>2L</p>
              <input
                type="range"
                name="activityInput"
                id="activityInput"
                min={2}
                max={6}
                value={hydrationGoal}
                onChange={(e) => setHydrationGoal(e.target.value)}
                required
              />
              <p>6L</p>
            </div>
          </div>
          <div className="popupButtonContainer">
            <button type="submit">{w.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomePopup;
