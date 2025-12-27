import { Bar } from "react-chartjs-2";

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function PolesBar({ title, values, min, max }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: values.map((v) =>
          v >= (min + max) / 2 ? "#00A8FF" : "rgba(0,168,255,0.25)"
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
        min,
        max,
      },
    },
    datasets: {
      bar: { categoryPercentage: 1, barPercentage: 1 },
    },
  };

  return (
    <div className="caloriesWidgetBar">
      <p className="caloriesTitle">{title}</p>
      <div className="barContainer">
        <div className="lineTarget" />
        <div className="data">
          <Bar data={data} options={options} width={421} height={180} />
        </div>
      </div>
    </div>
  );
}

export default PolesBar;
