import { useCallback, useState, useRef, useEffect } from "react";
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
  Filler,
);
import Sidebar from "./Sidebar.jsx";
import "./Dashboard.css";
import TrendUp from "./assets/TrendUp.svg";
import TrendDown from "./assets/TrendDown.svg";
import LineChart from "./LineChart.jsx";
import DonutChart from "./DonutChart.jsx";
import WelcomePopup from "./WelcomePopup.jsx";
import WeightUpdatePopup from "./WeightUpdatePopup.jsx";

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const deficit = [0, -50, 120, 80, 0, -30, -100];


function useContainerWidth(ref) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    setWidth(ref.current.offsetWidth);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

export function Dashboard() {
  const caloriesRef = useRef(null);
  const sleepBarRef = useRef(null);
  const caloriesWidth = useContainerWidth(caloriesRef);
  const sleepBarWidth = useContainerWidth(sleepBarRef);

  const chartWidth = (containerWidth) =>
    containerWidth > 0 ? Math.max(containerWidth - 40, 200) : 450;

  const {
    currentHydration,
    hydrationGoal,
    waterProgressWidth,
    caloriesCount,
    lastNightSleep,
    weekMinutes,
    sleepWeekMinutes,
    getSleepComparison,
    getWeightComparison,
    weekFood,
    caloriesGoal,
    currentWeight,
    goalWeight,
    showWelcomePopup,
    setShowWelcomePopup,
    currentChallenge,
    setCurrentChallenge,
    toggleChallengeItem,
    weightUpdated,
    setWeightUpdated,
    weightWeekData,
  } = useDashboard();

  const weightValues = (() => {
    const result = [null, null, null, null, null, null, null];
    (weightWeekData || []).forEach((entry) => {
      const date = new Date(entry.date);
      const dayIndex = date.getDay();
      const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
      result[mapped] = entry.weight;
    });
    return result;
  })();

  const weightWeekSubtitle = (() => {
    const entries = (weightWeekData || []).filter((e) => e.weight > 0);
    if (entries.length < 2) return "No data yet";
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const diff = (sorted[sorted.length - 1].weight - sorted[0].weight).toFixed(
      1,
    );
    return diff > 0 ? `+${diff}Kg this Week` : `${diff}Kg this Week`;
  })();

  const sleepComparison = getSleepComparison();
  const weightComparison = getWeightComparison();

  const sleepValues = sleepWeekMinutes;
  const activityValues = weekMinutes.map((v) => (v === 0 ? null : v));

  const activityOptions = {
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
          d <= 0 ? "#00A8FF" : "rgba(0, 168, 255, 0.25)",
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
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
          v >= 7 ? "#00A8FF" : "rgba(0, 168, 255, 0.25)",
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
      },
    ],
  };

  const sleepOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
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

   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!weightUpdated && !showWelcomePopup ? (
        <WeightUpdatePopup setDailyWeightUpdated={setWeightUpdated} />
      ) : null}
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
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="smallWidget" onClick={goToWater}>
              <p className="smallWidgetTitle">Water</p>
              <p className="smalWidgetDesc">
                {currentHydration.toFixed(1)} L /{" "}
                {(hydrationGoal * 1).toFixed(1)} L
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
                <p className="smalWidgetDesc">
                  {currentWeight ? `${currentWeight}Kg` : "No data"}
                </p>
                <img
                  src={weightComparison?.isIncrease ? TrendUp : TrendDown}
                  alt="trend"
                />
                <p className="smallWidgetDesc2">
                  {weightComparison?.percentChange ?? 0}%
                </p>
              </div>
              <p className="smallWidgetGrayDesc">
                Goal: {goalWeight} Kg (
                {goalWeight - currentWeight > 0
                  ? `+${goalWeight - currentWeight}Kg to gain`
                  : `${goalWeight - currentWeight}Kg to lose`}
                )
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
            <div
              className="caloriesWidgetBar"
              onClick={goToFood}
              ref={caloriesRef}
            >
              <p className="caloriesTitle">Calories vs Goal</p>
              <div className="barContainer">
                <div className="lineTarget" />
                <div className="data">
                  <Bar
                    data={caloriesData}
                    options={caloriesOptions}
                    width={chartWidth(caloriesWidth)}
                    height={180}
                  />
                </div>
              </div>
              <p className="waterTarget">4 / 7 days on target</p>
            </div>

            <div className="dailyChallenges">
              <p className="widgetTitle">Daily Challenges</p>
              <form>
                {currentChallenge?.map((item) => (
                  <div key={item.id} className="inputGroup2">
                    <input
                      type="checkbox"
                      id={item.id}
                      className="circleCheckbox"
                      checked={item.completed ?? false}
                      onChange={() => toggleChallengeItem(item.id)}
                    />
                    <label
                      htmlFor={item.id}
                      className="circleLabel"
                      style={item.completed ? { textDecoration: "line-through", opacity: 0.5 } : {}}
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </form>
            </div>

            <div
              className="caloriesWidgetBar"
              onClick={goToSleep}
              ref={sleepBarRef}
            >
              <p className="caloriesTitle">Sleep This Week</p>
              <div className="barContainer">
                <div className="lineTarget" />
                <div className="data">
                  <Bar
                    data={sleepData}
                    options={sleepOptions}
                    width={chartWidth(sleepBarWidth)}
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
              options={sleepOptions}
              subtitle={weightWeekSubtitle}
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
                {currentHydration.toFixed(1)} / {(hydrationGoal * 1).toFixed(1)}{" "}
                L
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
