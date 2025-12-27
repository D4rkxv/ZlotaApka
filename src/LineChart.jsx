import { Line } from "react-chartjs-2";

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function LineChart({ title, values, min, max }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: "#0ea5e9",
        fill: false,
        pointRadius: 3,
        pointBackgroundColor: "#0ea5e9",
      },
    ],
  };

  const options = {
    responsive: false,
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
        min,
        max,
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
    <div className="caloriesWidgetBar">
      <p className="caloriesTitle">{title}</p>
      <div className="barContainer">
        <div className="data">
          <Line data={data} options={options} width={421} height={180} />
        </div>
      </div>
      <p className="waterTarget">+0.6Kg last Week</p>
    </div>
  );
}

export default LineChart;
