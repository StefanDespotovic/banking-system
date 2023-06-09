import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import LineGraphIcon from "./LineGraphIcon";

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

  useEffect(() => {
    updateBalances(chartData);
  }, [chartData]);

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

  return (
    <LineGraphIcon
      chartData={chartData}
      yAxisLabels={yAxisLabels}
      lineColor="#007BFF"
    />
  );
};

export default LineGraph;
