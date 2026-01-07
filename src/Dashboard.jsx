import { useCallback, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDashboard } from "./DashboardContext.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);
import Sidebar from "./Sidebar.jsx";
import "./Dashboard.css";
import TrendUp from "./assets/TrendUp.svg";
import TrendDown from "./assets/TrendDown.svg";
import LineChart from "./LineChart.jsx";
import DonutChart from "./DonutChart.jsx";
import WelcomePopup from "./WelcomePopup.jsx";

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const weightValues = [84, 79.8, 79.5, 76.2, 79, 78.9, 75.7];

const deficit = [0, -50, 120, 80, 0, -30, -100];

export function Dashboard() {
  const {
    currentHydration,
    hydrationGoal,
    waterProgressWidth,
    caloriesCount,
    lastNightSleep,
    weekMinutes,
    sleepWeekMinutes,
    getSleepComparison,
    weekFood,
    caloriesGoal,
    currentWeight,
    goalWeight,
    showWelcomePopup,
    setShowWelcomePopup,
  } = useDashboard();

  const sleepComparison = getSleepComparison();
  const sleepValues = sleepWeekMinutes;
  const activityValues = weekMinutes;
  const activityOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        offset: true,
        grid: { display: false },
        ticks: {
          color: "#9ca3af",
          font: { size: 12, family: "Poppins" },
        },
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 0.3,
        barPercentage: 0.3,
      },
    },
  };

  const { goToDashboard, goToWater, goToFood, goToWorkouts, goToSleep } =
    useDashboard();
  const caloriesData = {
    labels,
    datasets: [
      {
        label: "Calories vs Goal",
        data: weekFood,
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
        min: 0,
        beginAtZero: true,
        suggestedMax: 3200,
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 1,
        barPercentage: 1,
      },
    },
  };

  const sleepData = {
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

  const sleepOptions = {
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
    <>
      {showWelcomePopup ? (
        <WelcomePopup setPopupVisibility={setShowWelcomePopup} />
      ) : null}
      <div className="dashboardContainer siteContainer">
        <Sidebar />

        <div className="widgetContainer">
          <p className="siteTitle">Dashboard</p>

          <div className="topWidgets">
            <div className="smallWidget" onClick={goToFood}>
              <p className="smallWidgetTitle">Calories</p>
              <p className="smalWidgetDesc">
                {caloriesCount} / {caloriesGoal}
              </p>
              <div className="progressWrapper">
                <div className="progressTrack">
                  <div
                    className="progressFill"
                    style={{
                      width: `${Math.min(
                        ((caloriesCount / caloriesGoal) * 100).toFixed(0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="smallWidget" onClick={goToWater}>
              <p className="smallWidgetTitle">Water</p>
              <p className="smalWidgetDesc">
                {" "}
                {currentHydration.toFixed(1)} L / {hydrationGoal.toFixed(1)} L
              </p>
              <div className="progressWrapper">
                <div className="progressTrack">
                  <div
                    className="progressFill"
                    style={{ width: `${waterProgressWidth}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="smallWidget">
              <p className="smallWidgetTitle">Weight</p>
              <div className="descLine">
                <p className="smalWidgetDesc">{currentWeight}Kg</p>
                <img src={TrendUp} alt="trend up" />
                <p className="smallWidgetDesc2">0.2%</p>
              </div>
              <p className="smallWidgetGrayDesc">
                Goal: {goalWeight} Kg ( +6 remaining)
              </p>
            </div>

            <div className="smallWidget" onClick={goToSleep}>
              <p className="smallWidgetTitle">Sleep</p>
              <div className="descLine">
                <p className="smalWidgetDesc">
                  {lastNightSleep[0] > 0 ? `${lastNightSleep[0]}h ` : ""}
                  {lastNightSleep[1] > 0 ? `${lastNightSleep[1]}min ` : ""}
                  {lastNightSleep[0] <= 0 && lastNightSleep[1] <= 0
                    ? "No sleep "
                    : ""}
                </p>
                <img
                  src={sleepComparison?.percentChange > 0 ? TrendUp : TrendDown}
                  alt="trend down"
                />
                <p className="smallWidgetDesc2">
                  {sleepComparison?.percentChange ?? 0}%
                </p>
              </div>
              <p className="smallWidgetGrayDesc">
                Last:{" "}
                {sleepComparison?.yesterdayMinutes > 0
                  ? `${Math.floor(sleepComparison?.yesterdayMinutes / 60)}h`
                  : `No sleep before`}
              </p>
            </div>
          </div>

          <div className="midWidgets">
            <div className="caloriesWidgetBar" onClick={goToFood}>
              <p className="caloriesTitle">Calories vs Goal</p>
              <div className="barContainer">
                <div className="lineTarget" />
                <div className="data">
                  <Bar
                    data={caloriesData}
                    options={caloriesOptions}
                    width={450}
                    height={180}
                  />
                </div>
              </div>
              <p className="waterTarget">4 / 7 days on target</p>
            </div>

            <div className="dailyChallenges">
              <p className="widgetTitle">Daily Challenges</p>
              <form>
                <div className="inputGroup2">
                  <input
                    type="checkbox"
                    id="task1"
                    className="circleCheckbox"
                  />
                  <label htmlFor="task1" className="circleLabel">
                    Drink 2.5L of water
                  </label>
                </div>
                <div className="inputGroup2">
                  <input
                    type="checkbox"
                    id="task2"
                    className="circleCheckbox"
                  />
                  <label htmlFor="task2" className="circleLabel">
                    Walk 8 000 steps
                  </label>
                </div>
                <div className="inputGroup2">
                  <input
                    type="checkbox"
                    id="task3"
                    className="circleCheckbox"
                  />
                  <label htmlFor="task3" className="circleLabel">
                    Log 40 min workout
                  </label>
                </div>
                <div className="inputGroup2">
                  <input
                    type="checkbox"
                    id="task4"
                    className="circleCheckbox"
                  />
                  <label htmlFor="task4" className="circleLabel">
                    Try new diet
                  </label>
                </div>
              </form>
            </div>
            <div className="caloriesWidgetBar" onClick={goToSleep}>
              <p className="caloriesTitle">Sleep This Week</p>
              <div className="barContainer">
                <div className="lineTarget" />
                <div className="data">
                  <Bar
                    data={sleepData}
                    options={sleepOptions}
                    width={450}
                    height={180}
                  />
                </div>
              </div>
              <p className="waterTarget">4 / 7 days on target</p>
            </div>
          </div>
          <div className="botWidgets">
            <LineChart
              title="Weight Trend"
              values={weightValues}
              min={65}
              max={90}
            />
            <div className="smallWaterContainer" onClick={goToWater}>
              <p className="caloriesTitle">Water</p>
              <div className="donutDashboardChartContainer">
                <DonutChart
                  current={currentHydration}
                  goal={hydrationGoal}
                  size={190}
                />
              </div>
              <p className="waterTarget">
                {currentHydration.toFixed(1)} / {hydrationGoal.toFixed(1)} L
              </p>
            </div>
            <div className="lineChartContainer" onClick={goToWorkouts}>
              <LineChart
                title="Activity Minutes"
                values={activityValues}
                options={activityOptions}
                min={0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
