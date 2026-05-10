import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import { useDashboard } from "./DashboardContext.jsx";
import "./SleepTracker.css";
import { useLanguage } from "./LanguageContext.jsx";
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
  const tips = [];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const {
    inBedTime,
    setInBedTime,
    outOfBedTime,
    setOutOfBedTime,
    sleepQuality,
    setSleepQuality,
    lastNightSleep,
    logSleep,
    score,
    profileInBedTime,
    profileOutOfBedTime,
    sleepWeekMinutes,
    sleepTime,
  } = useDashboard();
  const [selectedTip, setSelectedTip] = useState("");
  const { t } = useLanguage();
  const s = t.sleep;
  const sleepTips = t.sleepTips;
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sleepTips.length);
    setSelectedTip(sleepTips[randomIndex]);
  }, [sleepTips]);

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
    responsive: true,
    maintainAspectRatio: false,
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
        data: sleepWeekMinutes.map((minutes) => minutes / 60),
        backgroundColor: sleepWeekMinutes.map((v) =>
          v / 60 >= 7 ? "#00A8FF" : "rgba(0, 168, 255, 0.25)",
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
      },
    ],
  };

  const sleepThisWeekOptions = {
    responsive: true,
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
        display: true,
        min: 0,
        beginAtZero: true,
        max: 24,
        ticks: {
          callback: function (value) {
            return value + "h";
          },
        },
      },
    },
  };
   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div className="sleepContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">{s.title}</p>
        <div className="divider">
          <div className="sleepSummaryContainer">
            <p className="sectionTitle">{s.sleepSummary}</p>
            <p className="lastNightSummary">
              {lastNightSleep[0] > 0 ? `${lastNightSleep[0]}h ` : ""}
              {lastNightSleep[1] > 0 ? `${lastNightSleep[1]}min ` : ""}
              {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0
                ? `${s.noSleep} `
                : ""}
              {s.lastNight}
            </p>
            <p className="sleepGoal">
              {s.sleepGoal} {sleepTime[0] > 0 ? `${sleepTime[0]}h` : ""}
              {sleepTime[1] > 0 ? `${sleepTime[1]}min` : ""}
            </p>
            <div className="progressTrack">
              <div
                className="progressFill2"
                style={{
                  width: `${Math.min(
                    ((lastNightSleep[0] / sleepTime[0]) * 100).toFixed(0),
                    100,
                  )}%`,
                }}
              />
            </div>
            <p className="sleepStartEndTime">
              {s.inBedAt} {profileInBedTime || s.na} • {s.wokeUpAt}{" "}
              {profileOutOfBedTime || s.na}
            </p>
          </div>
          <div className="sleepScoreContainer">
            <p className="sectionTitle">{s.sleepScore}</p>
            <div className="divider">
              <div className="chartContainer">
                <Doughnut data={sleepScoreData} options={sleepScoreOptions} key={windowWidth} />
              </div>
              <div className="sleepScoreDetails">
                <p>
                  {s.timeAsleep}
                  {lastNightSleep[0] > 0 ? ` ${lastNightSleep[0]}h` : ""}
                  {lastNightSleep[1] > 0 ? ` ${lastNightSleep[1]}min` : ""}
                  {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0
                    ? ` ${s.noSleep}`
                    : ""}
                </p>
                <p>{s.wokeUpAt} {profileOutOfBedTime}</p>
                <p>{s.scoreLabel} {score > 0 ? score : "0"}%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="divider">
          <div className="sleepLogContainer">
            <p className="sectionTitle">{s.sleepLog}</p>
            <form onSubmit={handleSave}>
              <div className="goneToBedInputContainer">
                <label htmlFor="goneToBedInput">{s.goneToBed}</label>
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
                <label htmlFor="outOfBedInput">{s.outOfBed}</label>
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
                <p>{s.sleepQuality}</p>
                <div className="optionContainer">
                  <input type="radio" id="poorSleep" value={"poor"} checked={sleepQuality === "poor"} onChange={handleChange} name="sleepQuality" required />
                  <label htmlFor="poorSleep">{s.poor}</label>
                </div>
                <div className="optionContainer">
                  <input type="radio" id="averageSleep" value={"average"} checked={sleepQuality === "average"} onChange={handleChange} name="sleepQuality" required />
                  <label htmlFor="averageSleep">{s.average}</label>
                </div>
                <div className="optionContainer">
                  <input type="radio" id="goodSleep" value={"good"} checked={sleepQuality === "good"} onChange={handleChange} name="sleepQuality" required />
                  <label htmlFor="goodSleep">{s.good}</label>
                </div>
                <div className="optionContainer">
                  <input type="radio" id="excellentSleep" value={"excellent"} checked={sleepQuality === "excellent"} onChange={handleChange} name="sleepQuality" required />
                  <label htmlFor="excellentSleep">{s.excellent}</label>
                </div>
              </div>
              <button className="workoutBtn1">
                {profileOutOfBedTime && profileInBedTime
                  ? s.updateSleep
                  : s.logSleep}
              </button>
            </form>
          </div>
          <div className="sleepWeekChartContainer">
            <p className="sectionTitle">{s.sleepThisWeek}</p>
            <div className="chartContainer">
              <Bar data={sleepThisWeekData} options={sleepThisWeekOptions} key={windowWidth}/>
            </div>
          </div>
        </div>
        <div className="tip-container">
          <p className="sectionTitle">{s.tipOfDay}</p>
          <p>{selectedTip}</p>
        </div>
      </div>
    </div>
  );
}
export default SleepTracker;
