import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import styled from "styled-components";

const LineGraphIcon = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(50, 50, 50) 0%,
    rgb(0, 0, 0) 99.4%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 25vw;
`;

const LineGraph = ({ userData }) => {
  const { userId } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [highestBalance, setHighestBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/transactions?user_id=${userId}`
        );
        const data = await response.json();
        const processedData = processData(data);
        setChartData(processedData);
        updateBalances(processedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [userId]);

  const updateBalances = (data) => {
    const balances = data.map((item) => item.value);
    const current = balances.reduce((total, value) => total + value, 0);
    const highest = Math.max(...balances);
    setCurrentBalance(current);
    setHighestBalance(highest);
  };

  const processData = (transactions) => {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 30
    );

    const uniqueDates = [];
    const filteredTransactions = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= thirtyDaysAgo;
      })
      .filter((transaction) => {
        const dateString = new Date(transaction.date).toDateString();
        if (!uniqueDates.includes(dateString)) {
          uniqueDates.push(dateString);
          return true;
        }
        return false;
      });

    const chartData = filteredTransactions.map((transaction) => {
      const transactionDate = new Date(transaction.date);
      const date = transactionDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const value = transaction.current_balance;
      const sign = transaction.sign;
      return { date, value, sign };
    });

    return chartData;
  };

  const minValue = 0;
  const maxValue = highestBalance;
  const chartHeight = 300;
  const labelCount = 4;
  const labelStep = (maxValue - minValue) / (labelCount - 1);
  const yAxisLabels = Array.from(
    { length: labelCount },
    (_, index) => minValue + index * labelStep
  ).reverse();

  const [selectedData, setSelectedData] = useState(null);

  const handleDotHover = (data, x, y) => {
    setSelectedData({ ...data, x, y });
  };

  const handleDotLeave = () => {
    setSelectedData(null);
  };

  const y = ((currentBalance - minValue) / (maxValue - minValue)) * chartHeight;

  const lineColor = "#007BFF"; // Set the line color to #007BFF

  return (
    <LineGraphIcon>
      <svg width="100%" height="100%" viewBox={`-25 0 550 400`}>
        {/* Render the lines and circles for each data point */}
        {chartData.map((data, index) => {
          const x = (index * 500) / (chartData.length - 1);
          const y =
            chartHeight -
            ((data.value - minValue) / (maxValue - minValue)) * chartHeight;
          const nextData = chartData[index + 1];
          const nextX = nextData
            ? ((index + 1) * 500) / (chartData.length - 1)
            : x;
          const nextY = nextData
            ? chartHeight -
              ((nextData.value - minValue) / (maxValue - minValue)) *
                chartHeight
            : y;
          return (
            <g key={index}>
              <line
                x1={x}
                y1={y}
                x2={nextX}
                y2={nextY}
                stroke={lineColor}
                strokeWidth={2}
              />
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#FFFFFF"
                stroke={lineColor}
                strokeWidth={1}
                onMouseEnter={() => handleDotHover(data, x, y)}
                onMouseLeave={handleDotLeave}
              />
            </g>
          );
        })}
        {/* Render the y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <text
            key={index}
            x={20}
            y={(index / (labelCount - 1)) * chartHeight + 20}
            fontSize={12}
            textAnchor="end"
            dominantBaseline="middle"
            style={{ fill: "white" }}
          >
            {label.toFixed(2)}
          </text>
        ))}
        {/* Render the x-axis labels */}
        {chartData.map((data, index) => {
          const x = (index * 500) / (chartData.length - 1);
          return (
            <text
              key={index}
              x={x}
              y={chartHeight + 80}
              fontSize={12}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: "white" }}
            >
              {data.date}
            </text>
          );
        })}
      </svg>
    </LineGraphIcon>
  );
};

export default LineGraph;
