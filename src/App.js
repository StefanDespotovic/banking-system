import React, { useState } from "react";
import CreditCard from "./components/creditCard/CreditCard";
import Transactions from "./components/transactions/Transactions";
import AddBalance from "./components/addBalance/AddBalance";
// import Chart from "./components/chart/Chart";
import styled from "styled-components";

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 7vh;
  margin-left: 3vw;
`;
const History = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 12vh;
  margin-left: 3vw;
`;
const Balance = styled.div`
  position: relative;
  margin-left: 30vw;
  bottom: 62vh;
`;

const App = () => {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      seller: "Amazon",
      date: "Apr 20, 2023",
      time: "10:00 AM",
      price: "-99.99",
      currency: "USD",
    },
    {
      id: 2,
      seller: "Apple",
      date: "Apr 19, 2023",
      time: "2:30 PM",
      price: "-799.00",
      currency: "USD",
    },
    {
      id: 3,
      seller: "Starbucks",
      date: "Apr 18, 2023",
      time: "9:45 AM",
      price: "-3.50",
      currency: "USD",
    },
    {
      id: 4,
      seller: "Netflix",
      date: "Apr 17, 2023",
      time: "8:00 PM",
      price: "-14.99",
      currency: "USD",
    },
    {
      id: 5,
      seller: "Sallary",
      date: "Apr 15, 2023",
      time: "12:00 PM",
      price: "+980.00",
      currency: "USD",
    },
  ]);
  const handleAddBalance = (amount, seller) => {
    const newTransaction = {
      id: Math.floor(Math.random() * 100000),
      seller: seller,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      price: `+${parseFloat(amount).toFixed(2)}`,
      currency: "USD",
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance((prevBalance) => prevBalance + parseFloat(amount));
  };

  return (
    <>
      <Card>
        <CreditCard
          accountType="Credit Card"
          cardBrand="Visa"
          balance={balance.toFixed(2)}
          transactionNumber="1613000082767244"
        />
      </Card>
      <History>
        <Transactions transactions={transactions} />
      </History>
      <Balance>
        <AddBalance handleAddBalance={handleAddBalance} />
      </Balance>
      {/* <Chart /> */}
    </>
  );
};

export default App;
