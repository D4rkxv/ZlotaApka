import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { Bar } from "react-chartjs-2";
import "./Workouts.css";
import "./FoodDiary.css";
import running from "./assets/running.svg";
function Workouts() {
 
  const [tips, setTips] = useState([
"Plan one “non-negotiable” 20-minute activity today – schedule it in your calendar like a meeting and treat it as something you can’t cancel.",
"Commit to one “non-negotiable” 15-minute walk after breakfast – add it to your phone and do it rain or shine.",
"Set one “non-negotiable” 10-minute stretch session tonight – calendar it like an important call.",
"Pick one “non-negotiable” 5-minute push-up series first thing in the morning – set a reminder, no excuses.",
"Schedule one “non-negotiable” 10-minute meditation at noon – treat it like a boss meeting.",
"Do one “non-negotiable” 20-minute FBW workout after work – plan it in your app and stick to it.",
"Lock in one “non-negotiable” 15-minute bike ride – note the time and prioritize it.",
"Choose one “non-negotiable” 10-minute yoga before bed – alarm on, no skipping.",
"Plan one “non-negotiable” 5-minute squat set upon waking – add to calendar now.",
"Make one “non-negotiable” 20-minute dog walk – map the route and commit.",
"Set one “non-negotiable” 10-minute core work in your break – calendar as essential.",
"Do one “non-negotiable” 5-minute jump rope morning blast – timer ready.",
"Schedule one “non-negotiable” 15-minute leg stretch evening routine – non-optional.",
"Commit to one “non-negotiable” 3-minute plank daily – reminder set.",
"Pick one “non-negotiable” 10-minute brisk lunch walk – calendar block it.",
"Lock in one “non-negotiable” 5-minute pull-up session – no cancellations.",
"Plan one “non-negotiable” 10-minute breathing exercise – time it precisely.",
"Do one “non-negotiable” 15-minute dance to music – playlist queued, calendar added.",
"Set one “non-negotiable” 5-set diamond push-ups – treat as mandatory.",
"Choose one “non-negotiable” 20-minute post-dinner stroll – route planned.",
"Schedule one “non-negotiable” 10-minute face yoga – build into routine.",
"Commit to one “non-negotiable” 5-minute burpees morning kickoff – don't miss.",
"Pick one “non-negotiable” 15-minute arm work with dumbbells – meeting status.",
"Lock in one “non-negotiable” 10-minute deep breathing – alarm essential.",
"Plan one “non-negotiable” 20-minute upper body FBW – top priority.",
"Do one “non-negotiable” 10-minute home stairs climb – scheduled tight.",
"Set one “non-negotiable” 15-minute full-body stretch – calendar locked.",
"Choose one “non-negotiable” 5-minute jumping jacks – every single day.",
"Schedule one “non-negotiable” 20-minute walking meditation – no rescheduling.",
"Commit to one “non-negotiable” 10-set sumo squats – reminder active.",
"Pick one “non-negotiable” 15-minute stationary bike – must-do.",
"Lock in one “non-negotiable” 3-minute side plank – time blocked.",
"Plan one “non-negotiable” 10-minute glutes focus – take it seriously.",
"Do one “non-negotiable” 20-minute weighted walk – calendar entry.",
"Set one “non-negotiable” 5-minute HIIT burst morning – never skip.",
"Choose one “non-negotiable” 15-minute back stretch – plan ahead.",
"Schedule one “non-negotiable” 10-minute knee push-ups – priority high.",
"Commit to one “non-negotiable” 5-set deep squats – alarm on.",
"Pick one “non-negotiable” 10-minute mindfulness session – like a meeting.",
"Lock in one “non-negotiable” 15-minute in-place jog – daily habit.",
"Plan one “non-negotiable” 20-minute lower body FBW – no backing out.",
"Do one “non-negotiable” 3-minute wall sit – hour noted.",
"Set one “non-negotiable” 10-minute hip stretch – obligatory.",
"Choose one “non-negotiable” 5-minute mountain climbers – scheduled.",
"Schedule one “non-negotiable” 20-minute reflective walk – meeting-level.",
"Commit to one “non-negotiable” 10-set chair dips – reminder set.",
"Pick one “non-negotiable” 15-minute 4-7-8 breathing – calendar it.",
"Lock in one “non-negotiable” 5-minute supermans on floor – non-debatable.",
"Plan one “non-negotiable” 20-minute light yoga evening – always do.",
"Do one “non-negotiable” 15-minute calf raises – slot into your day."
​
]);
 const [exercise , setExercise] = useState(0);
 
 const [selectedTip, setSelectedTip] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);

  const [workoutsDone, setWorkoutsDone] = useState(4);
  const [workoutGoal, setWorkoutGoal] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => setIsActive(!isActive);

  const deficit = [`${0}`, `${-50}`, `${120}`, `${80}`, `${0}`, `${-30}`, `${-100}`];

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const caloriesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "",
        data: deficit.map((d) => 1000 - d),
        backgroundColor: deficit.map((d) =>
          d <= 0 ? "#00A8FF" : "rgba(0, 168, 255, 0.25)"
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
      },
    ],
  };

  const caloriesOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#9ca3af",
          font: { size: 12, family: "Poppins" },
        },
      },
      y: {
        display: false,
        min: 800,
        max: 1200,
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 1,
        barPercentage: 1,
      },
    },
  };
  return (
    <div className="workoutsContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">Workouts</p>
        <div className="topWorkoutContainer">
          <div className="leftTopContainer">
            <div className="leftTopWorkoutContainer">
              <div className="caloriesGoalContainer">
                <p className="sectionTitle">Workout Summary</p>
                <p className="caloriesCompletion">
                  {workoutsDone} / {workoutGoal} workouts this week
                </p>
                <p className="caloriesLeft">
                  Total time: 180 min • 1800kcal burned
                </p>
                <div className="progressTrack">
                  <div className="progressFill" />
                </div>
              </div>
              <div className="workoutsGoalStreakContainer">
                <Bar data={caloriesData} options={caloriesOptions} />
              </div>
            </div>
            <div className="leftBotWorkoutContainer">
              <div className="todayWorkoutContainer">
                <p className="sectionTitle">Today’s workout</p>
                <div className="todaysWorkoutInsideContainer">
                  <div className="todaysWorkoutLeft">
                    <div className="topTodaysWorkoutP">
                      <p className="leftTodaysWorkoutTitle">
                        Full Body Workout • 45min
                      </p>
                      <p className="todaysWorkoutProgress">
                        {2}/6 exercises done
                      </p>
                    </div>
                    <form>
                      <div className="workoutGroup" >
                        <input
                          type="checkbox"
                          id="task1"
                          className="circleCheckbox"
                          
                        />
                        <label htmlFor="task1" className="circleLabel">
                          Squats - 3x12
                        </label>
                      </div>
                      <div className="workoutGroup">
                        <input
                          type="checkbox"
                          id="task2"
                          className="circleCheckbox"
                      
                        />
                        <label htmlFor="task2" className="circleLabel">
                          Elevated push‑ups 3x8
                        </label>
                      </div>
                      <div className="workoutGroup">
                        <input
                          type="checkbox"
                          id="task3"
                          className="circleCheckbox"
                         
                        />
                        <label htmlFor="task3" className="circleLabel">
                          One‑arm dumbbell row 3x10
                        </label>
                      </div>
                      <div className="workoutGroup">
                        <input
                          type="checkbox"
                          id="task4"
                          className="circleCheckbox"
                        
                        />
                        <label htmlFor="task4" className="circleLabel">
                          Dumbbell overhead press 3x10
                        </label>
                      </div>
                      <div className="workoutGroup">
                        <input
                          type="checkbox"
                          id="task5"
                          className="circleCheckbox"
                   
                        />
                        <label htmlFor="task5" className="circleLabel">
                          Plank 3x40s
                        </label>
                      </div>
                      <div className="workoutGroup">
                        <input
                          type="checkbox"
                          id="task6"
                          className="circleCheckbox"
          
                        />
                        <label htmlFor="task6" className="circleLabel">
                          Glute bridge 3x12
                        </label>
                      </div>
                    </form>
                    <div className="todaysWorkoutProgressP">
                      <p className="todaysWorkoutProgress">
                        Estimated calories: ~280 kcal
                      </p>
                    </div>
                  </div>
                  <div className="todaysWorkoutRight">
                    <p className="timer">Timer</p>
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
                          <div className="timerText">{seconds}s</div>
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
                      <button
                        className="wideBtn transparentBtn `workoutBtn`"
                        onClick={handleClick}
                      >
                        {isActive ? "Pause" : "Start workout"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="activityHistory">
                <p className="sectionTitle">Activity History</p>
                <div className="activityHistoryContainer">
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">8:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">9:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">9:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">9:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                  <div className="activityOneLog">
                    <p className="activityTime">9:15</p>
                    <p className="acitivityTitle">- Running </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rightTopWorkoutContainer">
            <div className="workoutManagerTop">
              <p className="sectionTitle">Log activity</p>
              <p className="addActivity">Add Activity</p>
            </div>
            <div className="workoutList">
              <div className="workoutItem">
                <div className="workoutImgContainer">
                  <img src={running} />
                </div>
                <div className="workoutRightDesc">
                  <p className="activityType">Running • 40 min </p>
                  <p className="calories">~240kcal</p>
                </div>
              </div>
              <div className="workoutItem">
                <div className="workoutImgContainer">
                  <img src={running} />
                </div>
                <div className="workoutRightDesc">
                  <p className="activityType">Running • 40 min </p>
                  <p className="calories">~240kcal</p>
                </div>
              </div>
              <div className="workoutItem">
                <div className="workoutImgContainer">
                  <img src={running} />
                </div>
                <div className="workoutRightDesc">
                  <p className="activityType">Running • 40 min </p>
                  <p className="calories">~240kcal</p>
                </div>
              </div>
              <div className="workoutItem">
                <div className="workoutImgContainer">
                  <img src={running} />
                </div>
                <div className="workoutRightDesc">
                  <p className="activityType">Running • 40 min </p>
                  <p className="calories">~240kcal</p>
                </div>
              </div>
              <div className="workoutItem">
                <div className="workoutImgContainer">
                  <img src={running} />
                </div>
                <div className="workoutRightDesc">
                  <p className="activityType">Running • 40 min </p>
                  <p className="calories">~240kcal</p>
                </div>
              </div>
              <div className="workoutItem">
                <div className="workoutImgContainer">
                  <img src={running} />
                </div>
                <div className="workoutRightDesc">
                  <p className="activityType">Running • 40 min </p>
                  <p className="calories">~240kcal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="botWorkoutContainer">
          <div className="workoutTip">
            <p className="sectionTitle">Tip of the day</p>
            <p>{selectedTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Workouts;
