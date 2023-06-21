import React, { useState } from "react";
import styled from "styled-components";

const StyledLineGraphIcon = styled.div`
  position: relative;
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(0, 35, 95) 0%,
    rgb(0, 0, 0) 99.4%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 25vw;
  @media (max-width: 768px) {
    height: 60vw;
  }
`;
const Tooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
`;

const LineGraphIcon = ({ chartData, yAxisLabels, lineColor }) => {
  const minValue = 0;
  const maxValue = Math.max(...yAxisLabels);
  const chartWidth = 500;
  const chartHeight = 300;
  const labelCount = yAxisLabels.length;

  const labelWidth = chartWidth / (chartData.length || 1);

  const [tooltip, setTooltip] = useState("");

  const handleCircleHover = (data) => {
    setTooltip(`Transaction: ${data.value} USD`);
  };

  const handleCircleLeave = () => {
    setTooltip("");
  };

  return (
    <StyledLineGraphIcon>
      <svg width="100%" height="100%" viewBox="-25 0 550 400">
        {chartData.map((data, index) => {
          const x = index * labelWidth + labelWidth / 2;
          let y;
          if (chartData.length < 3 && index === 0) {
            y = chartHeight;
          } else {
            y =
              chartHeight -
              ((data.value - minValue) / (maxValue - minValue)) * chartHeight;
          }
          const nextData = chartData[index + 1];
          const nextX = nextData
            ? (index + 1) * labelWidth + labelWidth / 2
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
                y1={y + 20}
                x2={nextX}
                y2={nextY + 20}
                stroke={lineColor}
                strokeWidth={2}
              />
              <circle
                cx={x}
                cy={y + 20}
                r={4}
                fill="gray"
                stroke={"black"}
                strokeWidth={1}
                onMouseEnter={() => handleCircleHover(data)}
                onMouseLeave={handleCircleLeave}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}
        {/* Render the y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <text
            key={index}
            x={10}
            y={(index / (labelCount - 1)) * chartHeight + 25}
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
          const x = index * labelWidth;
          return (
            <text
              key={index}
              x={x + labelWidth / 2}
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
      {tooltip && <Tooltip>{tooltip}</Tooltip>}
    </StyledLineGraphIcon>
  );
};

export default LineGraphIcon;
