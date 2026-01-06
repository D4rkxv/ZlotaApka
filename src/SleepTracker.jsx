import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import { useDashboard } from "./DashboardContext.jsx";
import "./SleepTracker.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TimeSeriesScale,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function SleepTracker() {
  const [tips, setTips] = useState([
    "Go to bed and wake up at the same time every day to regulate your sleep cycle.",
    "Create a relaxing bedtime routine to signal your body that it’s time to sleep.",
    "Avoid screens at least one hour before bedtime to improve sleep quality.",
    "Keep your bedroom cool, dark, and quiet for better sleep.",
    "Limit caffeine intake in the afternoon and evening.",
    "Avoid heavy meals close to bedtime.",
    "Get natural sunlight exposure during the day to support your circadian rhythm.",
    "Use your bed only for sleep and rest, not for work or scrolling.",
    "Practice deep breathing or meditation before bed to relax your mind.",
    "Avoid naps longer than 20–30 minutes during the day.",
    "Try to go to bed before midnight for more restorative sleep.",
    "Reduce noise and light disturbances in your sleeping environment.",
    "Keep a consistent pre-sleep wind-down period every night.",
    "Avoid intense exercise right before bedtime.",
    "Limit alcohol consumption, as it can disrupt sleep cycles.",
    "Write down worries or to-do lists before bed to clear your mind.",
    "Make sure your mattress and pillow support comfortable sleep.",
    "Stop using electronic devices once you’re in bed.",
    "Wake up naturally if possible, instead of using loud alarms.",
    "Use soft lighting in the evening to prepare your body for sleep.",
    "Try reading a book instead of using your phone before bed.",
    "Avoid checking the clock if you wake up during the night.",
    "Maintain a comfortable room temperature for sleeping.",
    "Get out of bed if you can’t fall asleep after 20 minutes and relax elsewhere.",
    "Limit fluid intake right before bedtime to reduce night awakenings.",
    "Stretch gently in the evening to release tension.",
    "Establish a calming sleep environment with familiar scents or sounds.",
    "Expose yourself to daylight early in the morning.",
    "Avoid stressful conversations or tasks late at night.",
    "Focus on sleep consistency rather than perfection.",
  ]);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const {
    inBedTime,
    setInBedTime,
    outOfBedTime,
    setOutOfBedTime,
    sleepQuality,
    setSleepQuality,
    sleepGoal,
    setSleepGoal,
    lastNightSleep,
    setLastNightSleep,
    countScore,
    logSleep,
    score,
    setScore,
    setProfileInBedTime,
    profileInBedTime,
    profileOutOfBedTime,
    setProfileOutOfBedTime,
    sleepWeekMinutes,
    setSleepWeekMinutes,
  } = useDashboard();
  const [selectedTip, setSelectedTip] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleSave = (e) => {
    e.preventDefault();
    logSleep();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "inBedTime") setInBedTime(value);
    else if (name === "outOfBedTime") setOutOfBedTime(value);
    else setSleepQuality(value);
  };

  const sleepScoreData = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ["#00B0F0", "#E6F4FA"],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };

  const sleepScoreOptions = {
    rotation: -90,
    circumference: 180,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  const sleepThisWeekData = {
    labels,
    datasets: [
      {
        label: "Sleep This Week",
        data: sleepWeekMinutes,
        backgroundColor: sleepWeekMinutes.map((v) =>
          v >= 7 ? "#00A8FF" : "rgba(0, 168, 255, 0.25)"
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
      },
    ],
  };

  const sleepThisWeekOptions = {
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
        min: 0,
        beginAtZero: true,
        suggestedMax: 10,
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
    <div className="sleepContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">Sleep Tracking</p>
        <div className="divider">
          <div className="sleepSummaryContainer">
            <p className="sectionTitle">Sleep Summary</p>
            <p className="lastNightSummary">
              {lastNightSleep[0] > 0 ? `${lastNightSleep[0]}h ` : ""}
              {lastNightSleep[1] > 0 ? `${lastNightSleep[1]}min ` : ""}
              {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0
                ? "No sleep "
                : ""}
              last night
            </p>
            <p className="sleepGoal">
              Sleep goal: {sleepGoal[0] > 0 ? `${sleepGoal[0]}h` : ""}
              {sleepGoal[1] > 0 ? `${sleepGoal[1]}min` : ""}
            </p>
            <div className="progressTrack">
              <div
                className="progressFill2"
                style={{
                  width: `${Math.min(
                    ((lastNightSleep[0] / sleepGoal[0]) * 100).toFixed(0),
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="sleepStartEndTime">
              In bed at: {profileInBedTime} • Woke up at: {profileOutOfBedTime}
            </p>
          </div>
          <div className="sleepScoreContainer">
            <p className="sectionTitle">Sleep Score</p>
            <div className="divider">
              <div className="chartContainer">
                <Doughnut data={sleepScoreData} options={sleepScoreOptions} />
              </div>
              <div className="sleepScoreDetails">
                <p>
                  Time Asleep:
                  {lastNightSleep[0] > 0 ? ` ${lastNightSleep[0]}h` : ""}
                  {lastNightSleep[1] > 0 ? ` ${lastNightSleep[1]}min` : ""}
                  {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0
                    ? " No sleep"
                    : ""}
                </p>
                <p>Woke up at: {profileOutOfBedTime}</p>
                <p>Sleep score: {score > 0 ? score : "0"}%</p>
              </div>
            </div>
            <p className="sleepScore">{score > 0 ? score : "0"}/100</p>
          </div>
        </div>
        <div className="divider">
          <div className="sleepLogContainer">
            <p className="sectionTitle">Sleep Log</p>
            <form onSubmit={handleSave}>
              <div className="goneToBedInputContainer">
                <label htmlFor="goneToBedInput">Gone to bed at:</label>
                <input
                  type="time"
                  id="goneToBedInput"
                  name="inBedTime"
                  value={inBedTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="outOfBedInputContainer">
                <label htmlFor="outOfBedInput">Out of bed at:</label>
                <input
                  type="time"
                  id="outOfBedInput"
                  name="outOfBedTime"
                  value={outOfBedTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sleepQualityContainer">
                <p>Sleep quality:</p>
                <div className="optionContainer">
                  <input
                    type="radio"
                    id="poorSleep"
                    value={"poor"}
                    checked={sleepQuality === "poor"}
                    onChange={handleChange}
                    name="sleepQuality"
                    required
                  />
                  <label htmlFor="poorSleep">Poor</label>
                </div>
                <div className="optionContainer">
                  <input
                    type="radio"
                    id="averageSleep"
                    value={"average"}
                    checked={sleepQuality === "average"}
                    onChange={handleChange}
                    name="sleepQuality"
                    required
                  />
                  <label htmlFor="averageSleep">Average</label>
                </div>
                <div className="optionContainer">
                  <input
                    type="radio"
                    id="goodSleep"
                    value={"good"}
                    checked={sleepQuality === "good"}
                    onChange={handleChange}
                    name="sleepQuality"
                    required
                  />
                  <label htmlFor="goodSleep">Good</label>
                </div>
                <div className="optionContainer">
                  <input
                    type="radio"
                    id="excellentSleep"
                    value={"excellent"}
                    checked={sleepQuality === "excellent"}
                    onChange={handleChange}
                    name="sleepQuality"
                    required
                  />
                  <label htmlFor="excellentSleep">Excellent</label>
                </div>
              </div>
              <button className="workoutBtn1">Log Sleep</button>
            </form>
          </div>
          <div className="sleepWeekChartContainer">
            <p className="sectionTitle">Sleep This Week</p>
            <div className="chartContainer">
              <Bar data={sleepThisWeekData} options={sleepThisWeekOptions} />
            </div>
          </div>
        </div>
        <div className="tip-container">
          <p className="sectionTitle">Tip of the day</p>
          <p>{selectedTip}</p>
        </div>
      </div>
    </div>
  );
}
export default SleepTracker;
