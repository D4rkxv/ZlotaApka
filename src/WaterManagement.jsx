import React, { createContext, useContext, useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import "./WaterManagement.css";
import Edit from "./assets/Edit.svg";
import WaterGlass from "./assets/WaterGlass.svg";
import { Bar } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import { useDashboard } from "./DashboardContext";

const WaterManagement = () => {
  const {
    currentHydration,
    setCurrentHydration,
    hydrationGoal,
    setHydrationGoal,
  } = useDashboard();
  // const [hydrationGoal, setHydrationGoal] = useState(3.0);
  // const [currentHydration, setCurrentHydration] = useState(1.7);
  const [tips, setTips] = useState([
    "Drink a glass of water first thing in the morning to rehydrate your body.",
    "Carry a reusable water bottle to remind yourself to drink throughout the day.",
    "Add lemon, cucumber, or mint to your water for a refreshing taste.",
    "Set a daily water goal, like 8 glasses, and track your progress.",
    "Drink water before meals to support digestion and control appetite.",
    "Choose water over sugary drinks to stay hydrated without extra calories.",
    "Stay hydrated during workouts to improve performance and recovery.",
    "Use phone reminders or app notifications to drink water regularly.",
    "Monitor the color of your urine – light yellow indicates proper hydration.",
    "Drink water at different temperatures to keep it interesting.",
    "Sip water slowly throughout the day instead of chugging all at once.",
    "Replace one cup of coffee or tea with water to reduce dehydration.",
    "Keep a glass of water at your desk or bedside to drink more often.",
    "Infuse water with berries or herbs for a natural flavor boost.",
    "Drink a glass of water after each bathroom break to maintain intake.",
    "Hydrate before, during, and after long periods of sun exposure.",
    "Use a water tracking app to gamify your hydration habits.",
    "Drink water before feeling thirsty to stay ahead of dehydration.",
    "Pair water breaks with routine activities, like after brushing teeth.",
    "Remember that sparkling water counts toward your daily intake too.",
    "Eat water-rich foods like fruits and vegetables to supplement hydration.",
    "Replace soda or juice with water during meals for healthier habits.",
    "Drink a small glass of water before and after exercise.",
    "Make drinking water a part of your mindfulness routine.",
  ]);
  const [selectedTips, setSelectedTips] = useState([]);
  const data = {
    labels: [
      "20 Dec",
      "21 Dec",
      "22 Dec",
      "23 Dec",
      "24 Dec",
      "25 Dec",
      "26 Dec",
      "27 Dec",
      "28 Dec",
      "29 Dec",
      "30 Dec",
      "31 Dec",
    ],
    datasets: [
      {
        data: [
          2300, 2900, 3700, 3000, 2100, 3450, 2600, 3500, 1950, 3300, 2850,
          2500,
        ],
        backgroundColor: "#1DA1F2",
        borderRadius: 8,
        barThickness: 18,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 1000,
        max: 4000,
        ticks: {
          stepSize: 500,
          font: { size: 12, family: "Poppins" },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const handleHydrationChange = (amount) => {
    setCurrentHydration((prev) => Math.max(0, prev + amount));
  };

  useEffect(() => {
    setSelectedTips([]);
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      if (!selectedTips.includes(tips[randomIndex])) {
        setSelectedTips((prev) => [...prev, tips[randomIndex]]);
      }
    }
  }, []);

  return (
    <div className="waterManagementContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">Water Management</p>
        <div className="divider">
          <div className="leftSide">
            <div className="hydrationTrackerContainer">
              <p className="sectionTitle">Hydration Tracker</p>
              <div className="centeredContainer">
                <div className="donutChartContainer">
                  <DonutChart
                    current={currentHydration}
                    goal={hydrationGoal}
                    size={278}
                  />
                </div>
                <p className="completion">
                  {currentHydration.toFixed(1)} L / {hydrationGoal.toFixed(1)} L
                </p>
                <div className="buttonsContainer">
                  <button
                    className="wideBtn transparentBtn"
                    onClick={() => {
                      handleHydrationChange(-0.1);
                    }}
                  >
                    -100ml
                  </button>
                  <button
                    className="wideBtn coloredBtn"
                    onClick={() => {
                      handleHydrationChange(0.1);
                    }}
                  >
                    +100ml
                  </button>
                  <button className="boxBtn coloredBtn">
                    <img src={Edit} alt="editGoals" />
                  </button>
                </div>
              </div>
            </div>
            <div className="hydrationSummaryContainer">
              <p className="sectionTitle">Hydration summary</p>
              <ul>
                <li>Average this week: 2.6L</li>
                <li>Best day: Tue - 3.5L</li>
              </ul>
            </div>
          </div>
          <div className="rightSide">
            <div className="intakeTrendsContainer">
              <p className="sectionTitle">Intake trends</p>
              <div className="barChartContainer">
                <Bar data={data} options={options} />
              </div>
            </div>
            <div className="divider">
              <div className="waterLogContainer">
                <p className="sectionTitle">Water log</p>
                <div className="waterLog">
                  <div className="logEntry">
                    <img src={WaterGlass} alt="Glass of water" />
                    <p>8:20 - 300ml</p>
                  </div>
                  <div className="logEntry">
                    <img src={WaterGlass} alt="Glass of water" />
                    <p>8:20 - 300ml</p>
                  </div>
                  <div className="logEntry">
                    <img src={WaterGlass} alt="Glass of water" />
                    <p>8:20 - 300ml</p>
                  </div>
                  <div className="logEntry">
                    <img src={WaterGlass} alt="Glass of water" />
                    <p>8:20 - 300ml</p>
                  </div>
                  <div className="logEntry">
                    <img src={WaterGlass} alt="Glass of water" />
                    <p>8:20 - 300ml</p>
                  </div>
                </div>
              </div>
              <div className="usefulTipsContainer">
                <p className="sectionTitle">Useful tips</p>
                <ul>
                  {selectedTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterManagement;
