import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.mainNumber),
        backgroundColor: [
          "#3b82f6", // blue
          "#22c55e", // green
          "#f97316", // orange
          "#a855f7", // purple
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
