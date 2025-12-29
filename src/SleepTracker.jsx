import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import "./SleepTracker.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function SleepTracker() {
  const [sleepGoal, setSleepGoal] = useState([8, 0]); 
  const [lastNightSleep, setLastNightSleep] = useState([7, 50]);
  const [inBedTime, setInBedTime] = useState("00:00");
  const [outOfBedTime, setOutOfBedTime] = useState("7:50");
  const [score, setScore] = useState(50);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sleepValues = [7.5, 6.5, 7, 7.8, 5.5, 8.2, 6.0];
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
  "Focus on sleep consistency rather than perfection."
    ]);
  const [selectedTip, setSelectedTip] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);

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
        data: sleepValues,
        backgroundColor: sleepValues.map((v) =>
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
        max: 10,
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
            <p className="lastNightSummary">{lastNightSleep[0] > 0 ? `${lastNightSleep[0]}h` : ''} {lastNightSleep[1] > 0 ? `${lastNightSleep[1]}min` : ''} {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0 ? 'No sleep' : ''} last night</p>
              <p className="sleepGoal">Sleep goal: {sleepGoal[0] > 0 ? `${sleepGoal[0]}h` : ''} {sleepGoal[1] > 0 ? `${sleepGoal[1]}min` : ''}</p>
              <div className="progressTrack">
                <div className="progressFill" />
              </div>
              <p className="sleepStartEndTime">In bed at: {inBedTime} • Woke up at: {outOfBedTime}</p>
          </div>
          <div className="sleepScoreContainer">
            <p className="sectionTitle">Sleep Score</p>
            <div className="divider">
              <div className="chartContainer">
                <Doughnut data={sleepScoreData} options={sleepScoreOptions} />
              </div>
              <div className="sleepScoreDetails">
                <p>Time Asleep {lastNightSleep[0] > 0 ? `${lastNightSleep[0]}h` : ''} {lastNightSleep[1] > 0 ? `${lastNightSleep[1]}min` : ''} {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0 ? 'No sleep' : ''}</p>
                <p>Woke up at: {outOfBedTime}</p>
                <p>Sleep score: {score}%</p>
              </div>
            </div>
            <p className="sleepScore">{score}/100</p>
          </div>
        </div>
        <div className="divider">
          <div className="sleepLogContainer">
            <p className="sectionTitle">Sleep Log</p>
            <div className="goneToBedInputContainer">
              <label htmlFor="goneToBedInput">Gone to bed at:</label>
              <input type="time" id="goneToBedInput" value={inBedTime} />
            </div>
            <div className="outOfBedInputContainer">
              <label htmlFor="outOfBedInput">Out of bed at:</label>
              <input type="time" id="outOfBedInput" value={outOfBedTime} />
            </div>
            <div className="sleepQualityContainer">
              <p>Sleep quality:</p>
              <div className="optionContainer">
                <input type="radio" id="poorSleep" name="sleepQuality" />
                <label htmlFor="poorSleep">Poor</label>
              </div>
              <div className="optionContainer">
                <input type="radio" id="averageSleep" name="sleepQuality" />
                <label htmlFor="averageSleep">Average</label>
              </div>
              <div className="optionContainer">
                <input type="radio" id="goodSleep" name="sleepQuality" />
                <label htmlFor="goodSleep">Good</label>
              </div>
              <div className="optionContainer">
                <input type="radio" id="excellentSleep" name="sleepQuality" />
                <label htmlFor="excellentSleep">Excellent</label>
              </div>
            </div>
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
