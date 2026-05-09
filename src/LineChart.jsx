import { Line } from "react-chartjs-2";
import { useRef } from "react";
import useContainerWidth from "./useContainerWidth";

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function LineChart({ title, values, min, max, subtitle }) {
  const containerRef = useRef(null);
  const containerWidth = useContainerWidth(containerRef);
  const chartWidth =
    containerWidth > 0 ? Math.max(containerWidth - 40, 200) : 450;

  const validValues = values.filter((v) => v !== null && v !== undefined);
  const computedMax =
    max !== undefined
      ? max
      : validValues.length > 0
        ? Math.max(...validValues) + 1
        : undefined;
  const computedMin =
    min !== undefined
      ? min
      : validValues.length > 0
        ? Math.min(...validValues) - 1
        : undefined;

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: "#0ea5e9",
        fill: false,
        spanGaps: false,
        pointRadius: values.map((v) => (v === null ? 0 : 3)),
        pointBackgroundColor: "#0ea5e9",
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
    interaction: { intersect: false, mode: "index" },
    scales: {
      x: {
        grid: { display: true },
        ticks: {
          color: "#9ca3af",
          font: { size: 12, family: "Poppins" },
        },
      },
      y: {
        display: true,
        min: computedMin,
        max: computedMax,
        ticks: {
          stepSize: 5,
          color: "#9ca3af",
          font: { size: 12, family: "Poppins" },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.25)",
        },
      },
    },
  };

  return (
    <div className="botWidgetBar" ref={containerRef}>
      <p className="caloriesTitle">{title}</p>
      <div className="barContainer">
        <div className="data">
          <Line data={data} options={options} width={chartWidth} height={180} />
        </div>
      </div>
      <p className="waterTarget">{subtitle ?? "+0.6Kg last Week"}</p>
    </div>
  );
}

export default LineChart;
