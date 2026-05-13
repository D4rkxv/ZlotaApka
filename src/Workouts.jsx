import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { Bar } from "react-chartjs-2";
import "./Workouts.css";
import "./FoodDiary.css";
import "./Dashboard.css";
import { useDashboard } from "./DashboardContext";
import WorkoutPopup from "./WorkoutPopup";
import { useLanguage } from "./LanguageContext.jsx";

function Workouts() {
  const { t } = useLanguage();
  const wk = t.workouts;
  const tips = t.workoutTips;
  const {
    logWorkout,
    activityHistory = [],
    workoutsDone,
    workoutProgressWidth,
    isActive,
    setIsActive,
    seconds,
    setSeconds,
    workoutStatus,
    setWorkoutStatus,
    isChecked,
    setIsChecked,
    isDisabled,
    setIsDisabled,
    allSeconds,
    quickActivities,
    allCalories,
    currentWorkout,
    weekMinutes,
    weeklyWorkouts,
  } = useDashboard();

  const [showWorkoutPopup, setShowWorkoutPopup] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(0);
  const [selectedTip, setSelectedTip] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const checkIfCompleted = () => {
    if (exerciseDone === 5) setWorkoutStatus("final");
    else setWorkoutStatus("running");
  };

  const handleExersiceClick = (index) => {
    checkIfCompleted();
    setIsChecked((prev) => {
      const current = Array.isArray(prev) ? prev : Array(6).fill(false);
      const wasChecked = current[index];
      setExerciseDone((prevCount) =>
        wasChecked ? prevCount - 1 : prevCount + 1,
      );
      const newChecked = [...current];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const handlePause = () => {
    setIsActive(!isActive);
    setIsDisabled(!isDisabled);
  };

  const handleClick = () => {
    setIsActive(!isActive);
    setIsDisabled(!isDisabled);
    setIsChecked(true);
    setWorkoutStatus("running");
  };

  const handleStop = () => {
    setSeconds(0);
    setIsActive(false);
    setIsChecked(Array(6).fill(false));
    setIsDisabled(true);
    setExerciseDone(0);
    setWorkoutStatus("idle");
  };

  const handleFinalClick = async () => {
    let workoutMins = Math.floor(seconds / 60);
    if (seconds > 0 && workoutMins === 0) workoutMins = 1;
    const workoutData = {
      name: currentWorkout?.name ?? "Full Body Workout",
      type: "strength_training",
      time: workoutMins,
      calories: Math.round(workoutMins * 5),
    };
    await logWorkout(workoutData);
    setWorkoutStatus("idle");
    setIsChecked(Array(6).fill(false));
    setIsDisabled(true);
    setSeconds(0);
    setIsActive(false);
    setExerciseDone(0);
  };

  const handleWorkoutItemClick = async (quickItem) => {
    const workoutData = {
      name: quickItem.name,
      type: quickItem.type || "cardio",
      time: Number(quickItem.time),
      calories: Number(quickItem.calories),
    };
    await logWorkout(workoutData);
  };

  const workoutData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Workout",
        data: weekMinutes,
        backgroundColor: weekMinutes.map((val) =>
          val > 40 ? "#00A8FF" : "rgba(0,168,255,0.25)",
        ),
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const caloriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        offset: true,
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { size: 12, family: "Poppins" } },
      },
      y: { display: false, min: 0, beginAtZero: true, suggestedMax: 60 },
    },
  };

  const renderLogActivity = () => (
    <>
      <div className="workoutManagerTop">
        <p className="sectionTitle">{wk.logActivity}</p>
        <p className="addActivity" onClick={() => setShowWorkoutPopup(true)}>
          {wk.addActivity}
        </p>
      </div>
      <div className="workoutList">
        {quickActivities.map((item) => (
          <div
            key={item.id}
            className="workoutItem"
            onClick={() => handleWorkoutItemClick(item)}
          >
            <div className="workoutImgContainer">
              <img src={item.icon} alt={item.name} />
            </div>
            <div className="workoutRightDesc">
              <p className="activityType">
                {item.name} • {item.time} min
              </p>
              <p className="calories">~{item.calories}kcal</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {showWorkoutPopup && (
        <WorkoutPopup setPopupVisibility={setShowWorkoutPopup} />
      )}
      <div className="workoutsContainer">
        <Sidebar />
        <div className="widgetContainer">
          <p className="siteTitle">{wk.title}</p>
          <div className="topWorkoutContainer">
            <div className="leftTopContainer">
              <div className="leftTopWorkoutContainer">
                <div className="caloriesGoalContainer">
                  <p className="sectionTitle">{wk.workoutSummary}</p>
                  <p className="caloriesCompletion">
                    {workoutsDone > 0 ? workoutsDone : "0"} / {weeklyWorkouts} {wk.workoutsThisWeek}
                  </p>
                  <p className="caloriesLeft">
                    {wk.totalTime} {(allSeconds / 60).toFixed(1)} min • {allCalories > 0 ? allCalories : "0"}kcal {wk.burned}
                  </p>
                  <div className="progressTrack">
                    <div
                      className="progressFill"
                      style={{ width: `${workoutProgressWidth}%` }}
                    />
                  </div>
                </div>
                <div className="workoutsGoalStreakContainer">
                  <Bar data={workoutData} options={caloriesOptions} />
                </div>
              </div>
              <div className="rightTopWorkoutContainer rightTopInline">
                {renderLogActivity()}
              </div>
              <div className="leftBotWorkoutContainer">
                <div className="todayWorkoutContainer">
                  <p className="sectionTitle">{wk.todaysWorkout}</p>
                  <div className="todaysWorkoutInsideContainer">
                    <div className="todaysWorkoutLeft">
                      <div className="topTodaysWorkoutP">
                        <p className="leftTodaysWorkoutTitle">
                          {currentWorkout?.name || "Full Body Workout"}•{" "}
                          {currentWorkout?.exercises?.length * 5 || 45}min
                        </p>
                        <p className="todaysWorkoutProgress">
                          {exerciseDone}/{currentWorkout?.exercises?.length || 6} {wk.exercisesDone}
                        </p>
                      </div>
                      <form>
                        {currentWorkout?.exercises?.map((workout, index) => (
                          <div key={workout.id} className="workoutGroup">
                            <input
                              type="checkbox"
                              id={workout.id}
                              className="circleCheckbox"
                              disabled={isDisabled}
                              checked={isChecked[index]}
                              onChange={() => handleExersiceClick(index)}
                            />
                            <label htmlFor={workout.id} className="circleLabel">
                              {workout.name}
                            </label>
                          </div>
                        ))}
                      </form>
                      <div className="todaysWorkoutProgressP">
                        <p className="todaysWorkoutProgress">{wk.estimatedCalories}</p>
                      </div>
                    </div>
                    <div className="todaysWorkoutRight">
                      <p className="timer">{wk.timer}</p>
                      <div className="timerContainer">
                        <svg viewBox="0 0 120 120" className="timerSvg">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#00a8ff"
                            strokeWidth="15"
                            strokeDasharray="314"
                            pathLength="1"
                            className="progressCircle"
                          />
                          <foreignObject x="30" y="45" width="60" height="30">
                            <div className="timerText">
                              {seconds > 0 ? seconds : "00"}s
                            </div>
                          </foreignObject>
                          <circle
                            cx="108"
                            cy="12"
                            r="6"
                            fill="#000000"
                            className="dot"
                          />
                        </svg>
                      </div>
                      <div className="todaysWorkoutRightBot">
                        {workoutStatus === "idle" ? (
                          <button className="workoutBtn1" onClick={handleClick}>{wk.startWorkout}</button>
                        ) : workoutStatus === "running" ? (
                          <>
                            <button className="workoutBtn2" onClick={handlePause}>{wk.pause}</button>
                            <button className="workoutBtn1" onClick={handleStop}>{wk.stopWorkout}</button>
                          </>
                        ) : (
                          <button className="workoutBtn1" onClick={handleFinalClick}>{wk.finishWorkout}</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="activityHistory">
                  <p className="sectionTitle">{wk.activityHistory}</p>
                  <div className="activityHistoryContainer">
                    {activityHistory.slice(0, 100).map((item) => (
                      <div key={item.id} className="historyItem">
                        {item.time} - {item.activity_name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="rightTopWorkoutContainer rightTopSide">
              {renderLogActivity()}
            </div>
          </div>

          <div className="botWorkoutContainer">
            <div className="workoutTip">
              <p className="sectionTitle">{wk.tipOfDay}</p>
              <p>{selectedTip}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Workouts;
