import { useState } from "react";
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

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const weightValues = [84, 79.8, 79.5, 76.2, 79, 78.9, 75.7];
const activityValues = [0, 10, 50, 25, 57, 43, 12];

const deficit = [0, -50, 120, 80, 0, -30, -100];
const sleepValues = [7.5, 6.5, 7, 7.8, 5.5, 8.2, 6.0];

export function Dashboard() {
  const {
    currentHydration,
    setCurrentHydration,
    hydrationGoal,
    setHydrationGoal,
  } = useDashboard();
  const { goToDashboard, goToWater, goToFood, goToWorkouts, goToSleep } =
    useDashboard();
  const caloriesData = {
    labels,
    datasets: [
      {
        label: "Calories vs Goal",
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
    <div className="dashboardContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">Dashboard</p>

        <div className="topWidgets">
          <div className="smallWidget">
            <p className="smallWidgetTitle">Calories</p>
            <p className="smalWidgetDesc">1820 / 3200</p>
            <div className="progressWrapper">
              <div className="progressTrack">
                <div className="progressFill" />
              </div>
            </div>
          </div>

          <div className="smallWidget" onClick={goToWater}>
            <p className="smallWidgetTitle">Water</p>
            <p className="smalWidgetDesc">1.7L / 3.0L</p>
            <div className="progressWrapper">
              <div className="progressTrack">
                <div className="progressFill" />
              </div>
            </div>
          </div>

          <div className="smallWidget">
            <p className="smallWidgetTitle">Weight</p>
            <div className="descLine">
              <p className="smalWidgetDesc">80Kg</p>
              <img src={TrendUp} alt="trend up" />
              <p className="smallWidgetDesc2">0.2%</p>
            </div>
            <p className="smallWidgetGrayDesc">Goal: 86 Kg ( +6 remaining)</p>
          </div>

          <div className="smallWidget">
            <p className="smallWidgetTitle">Sleep</p>
            <div className="descLine">
              <p className="smalWidgetDesc">10h</p>
              <img src={TrendDown} alt="trend down" />
              <p className="smallWidgetDesc2">5%</p>
            </div>
            <p className="smallWidgetGrayDesc">Last: 9h 50min</p>
          </div>
        </div>

        <div className="midWidgets">
          <div className="caloriesWidgetBar">
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
                <input type="checkbox" id="task1" className="circleCheckbox" />
                <label htmlFor="task1" className="circleLabel">
                  Drink 2.5L of water
                </label>
              </div>
              <div className="inputGroup2">
                <input type="checkbox" id="task2" className="circleCheckbox" />
                <label htmlFor="task2" className="circleLabel">
                  Walk 8 000 steps
                </label>
              </div>
              <div className="inputGroup2">
                <input type="checkbox" id="task3" className="circleCheckbox" />
                <label htmlFor="task3" className="circleLabel">
                  Log 40 min workout
                </label>
              </div>
              <div className="inputGroup2">
                <input type="checkbox" id="task4" className="circleCheckbox" />
                <label htmlFor="task4" className="circleLabel">
                  Try new diet
                </label>
              </div>
            </form>
          </div>
          <div className="caloriesWidgetBar">
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
          <LineChart
            title="Activity Minutes"
            values={activityValues}
            min={0}
            max={60}
          />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
