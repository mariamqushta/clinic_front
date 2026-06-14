import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement
);

function ChartSection() {

  const data = {
    labels: [
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri"
    ],

    datasets: [
      {
        data: [16, 20, 9, 5, 7, 15, 10],
        backgroundColor: "#9B8AFB"
      }
    ]
  };

  return (
    <>
      <h2 className="title">
        Appointments Overview
      </h2>

      <div className="chartContainer">
        <Bar data={data} />
      </div>
    </>
  );
}

export default ChartSection;