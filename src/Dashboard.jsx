// Dashboard.jsx
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar.jsx";
import "./Dashboard.css";
import TrendUp from "./assets/TrendUp.svg";
import TrendDown from "./assets/TrendDown.svg";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const deficit = [0, -50, 120, 80, 0, -30, -100];
export function Dashboard() {
  const [clickedInfo, setClickedInfo] = useState(null);

  const data = {
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

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => {
            const d = deficit[ctx.dataIndex];
            if (d > 0) return `${d} kcal brakowało do celu`;
            if (d < 0) return `${Math.abs(d)} kcal ponad cel`;
            return "Cel dokładnie trafiony";
          },
        },
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
    onClick: (evt, elements, chart) => {
      if (!elements.length) return;
      const el = elements[0];
      const index = el.index;
      const label = chart.data.labels[index];
      const d = deficit[index];
      setClickedInfo({ label, deficit: d });
    },
  };

  return (
    <div className="dashboardContainer">
      <div className="sidebar">okok</div>
      <div className="widgetContainer">
        <p className="siteTitle">Dashboard</p>
        <div className="topWidgets">
          <div className="smallWidget">
            <p className="smallWidgetTitle">Calories</p>
            <p className="smalWidgetDesc">1820 / 3200</p>
            <div className="progressWrapper">
              <div className="progressTrack">
                <div className="progressFill"></div>
              </div>
            </div>
          </div>
          <div className="smallWidget">
            <p className="smallWidgetTitle">Water</p>
            <p className="smalWidgetDesc">1.7L / 3.0L</p>
            <div className="progressWrapper">
              <div className="progressTrack">
                <div className="progressFill"></div>
              </div>
            </div>
          </div>
          <div className="smallWidget">
            <p className="smallWidgetTitle">Weight</p>
            <div className="descLine">
              <p className="smalWidgetDesc">80Kg</p>
              <img src={TrendUp} />
              <p className="smallWidgetDesc2">0.2%</p>
            </div>
            <p className="smallWidgetGrayDesc">Goal: 86 Kg ( +6 remaining)</p>
          </div>
          <div className="smallWidget">
            <p className="smallWidgetTitle">Sleep</p>
            <div className="descLine">
              <p className="smalWidgetDesc">10h</p>
              <img src={TrendDown} />
              <p className="smallWidgetDesc2">5%</p>
            </div>
            <p className="smallWidgetGrayDesc">Last: 9h 50min </p>
          </div>
        </div>
        <div className="midWidgets">
          <div className="caloriesWidgetBar">
            <p className="caloriesTitle">Calories vs Goal</p>
            <div className="barContainer">
              <div className="lineTarget" />
              <div className="data">
                <Bar data={data} options={options} width={421} height={180} />
              </div>
            </div>
            <p className="onTarget">4 / 7 days on target</p>
          </div>
          <div className="dailyChallenges">
            <p className="widgetTitle">Daily Challenges</p>
            <form>
              <input type="checkbox" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
