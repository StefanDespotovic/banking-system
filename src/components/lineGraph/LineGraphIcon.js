import React from "react";
import styled from "styled-components";

const StyledLineGraphIcon = styled.div`
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
  left: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 25vw;
`;

const LineGraphIcon = ({ chartData, yAxisLabels, lineColor }) => {
  const minValue = 0;
  const maxValue = Math.max(...yAxisLabels);
  const chartHeight = 300;
  const labelCount = yAxisLabels.length;

  return (
    <StyledLineGraphIcon>
      <svg width="100%" height="100%" viewBox="-25 0 550 400">
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
    </StyledLineGraphIcon>
  );
};

export default LineGraphIcon;