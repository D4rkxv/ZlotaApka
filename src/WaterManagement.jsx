import React, { createContext, useContext, useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import "./WaterManagement.css";
import Edit from "./assets/Edit.svg";
import Trashcan from "./assets/Trash_Full.svg";
import WaterGlass from "./assets/WaterGlass.svg";
import { Bar } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import { useDashboard } from "./DashboardContext";
import WaterPopup from "./WaterPopup";

const WaterManagement = () => {
  const {
    currentHydration,
    hydrationGoal,
    waterLog,
    water12Day,
    addWater,
    waterWeek,
    deleteWaterEntry,
  } = useDashboard();

  const [showCustomAdd, setShowCustomAdd] = useState(false);

  const getWeeklyAverage = () => {
    const nonZeroDays = waterWeek.filter((day) => day > 0);
    if (nonZeroDays.length === 0) return 0;
    const sum = nonZeroDays.reduce((acc, val) => acc + val, 0);
    return (sum / nonZeroDays.length).toFixed(1);
  };

  const getBestDay = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (!waterWeek || waterWeek.length === 0) return "No data";
    const max = Math.max(...waterWeek);
    if (max === 0) return "No data";
    const index = waterWeek.indexOf(max);
    return `${days[index]} - ${max.toFixed(1)}L`;
  };

  const generateLabels = () => {
    const mS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const { cycleStart } = useDashboard();

    if (!cycleStart) {
      const labels = [];
      const today = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        labels.push(`${date.getDate()} ${mS[date.getMonth()]}`);
      }
      return labels;
    }

    const labels = [];
    const startDate = new Date(cycleStart);
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      labels.push(`${date.getDate()} ${mS[date.getMonth()]}`);
    }
    return labels;
  };

  const [tips] = useState([
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
    labels: generateLabels(),
    datasets: [
      {
        data: water12Day.map((val) => val * 1000),
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
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        min: 0,
        beginAtZero: true,
        suggestedMax: 4000,
        ticks: { font: { size: 12, family: "Poppins" } },
        grid: { display: false },
      },
    },
  };

  useEffect(() => {
    const picked = [];
    const shuffled = [...tips].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 5 && i < shuffled.length; i++) {
      picked.push(shuffled[i]);
    }
    setSelectedTips(picked);
  }, []);

  const addCustomAmountOfWater = (amount) => {
    addWater(amount / 1000);
  };

  return (
    <>
      {showCustomAdd && (
        <WaterPopup
          setShowWaterCustomAddPopup={setShowCustomAdd}
          addCustomAmount={addCustomAmountOfWater}
        />
      )}

      <div className="waterManagementContainer siteContainer">
        <Sidebar />
        <div className="widgetContainer">
          <p className="siteTitle">Water Management</p>

          <div className="divider">
            {/* ── LEFT SIDE ── */}
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
                    {currentHydration.toFixed(1)} L /{" "}
                    {(hydrationGoal * 1).toFixed(1)} L
                  </p>
                  <div className="buttonsContainer">
                    <button
                      className="wideBtn transparentBtn"
                      onClick={() => {
                        if (waterLog.length > 0) deleteWaterEntry(0);
                      }}
                    >
                      -100ml
                    </button>
                    <button
                      className="wideBtn coloredBtn"
                      onClick={() => addWater(0.1)}
                    >
                      +100ml
                    </button>
                    <button
                      className="boxBtn coloredBtn"
                      onClick={() => setShowCustomAdd(true)}
                    >
                      <img src={Edit} alt="customAmount" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="hydrationSummaryContainer">
                <p className="sectionTitle">Hydration summary</p>
                <ul>
                  <li>Average this week: {getWeeklyAverage()}L</li>
                  <li>Best day: {getBestDay()}</li>
                </ul>
              </div>
            </div>

            {/* ── RIGHT SIDE ── */}
            <div className="rightSide">
              <div className="intakeTrendsContainer">
                <p className="sectionTitle">Intake trends</p>
                <div className="barChartContainer">
                  <Bar data={data} options={options} key={location.pathname} />
                </div>
              </div>

              <div className="divider">
                <div className="waterLogContainer">
                  <p className="sectionTitle">Water log</p>
                  <div className="waterLog">
                    {waterLog.map((entry, index) => (
                      <div className="logEntry" key={index}>
                        <div className="entryDescription">
                          <img src={WaterGlass} alt="Glass of water" />
                          <p>
                            {entry.time} • {(entry.amount * 1000).toFixed(0)}ml
                          </p>
                        </div>
                        <div className="entryOptions">
                          <button onClick={() => deleteWaterEntry(index)}>
                            <img src={Trashcan} alt="Delete entry" />
                          </button>
                        </div>
                      </div>
                    ))}
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
    </>
  );
};

export default WaterManagement;
