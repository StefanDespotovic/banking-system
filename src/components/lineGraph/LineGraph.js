import React, { useState } from "react";
import Chart, { Line } from "react-chartjs-2";

const LineGraph = () => {
  const [data, setData] = useState({
    datasets: [
      {
        label: "Transaction History",
        data: [
          {
            x: new Date("2023-05-01"),
            y: 100,
          },
          {
            x: new Date("2023-05-02"),
            y: 200,
          },
          {
            x: new Date("2023-05-03"),
            y: 300,
          },
          {
            x: new Date("2023-05-04"),
            y: 400,
          },
          {
            x: new Date("2023-05-05"),
            y: 500,
          },
        ],
      },
    ],
  });

  const options = {
    title: {
      text: "Transaction History",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  return (
    <div>
      <Line type="line" data={data} options={options} />
    </div>
  );
};

export default LineGraph;
