import React from "react";
import CreditCard from "./components/creditCard/CreditCard";
import Transactions from "./components/transactions/Transactions";

const transactions = [
  {
    id: 1,
    seller: "Amazon",
    date: "Apr 20, 2023",
    time: "10:00 AM",
    price: "99.99",
    currency: "USD",
  },
  {
    id: 2,
    seller: "Apple",
    date: "Apr 19, 2023",
    time: "2:30 PM",
    price: "799.00",
    currency: "USD",
  },
  {
    id: 3,
    seller: "Starbucks",
    date: "Apr 18, 2023",
    time: "9:45 AM",
    price: "3.50",
    currency: "USD",
  },
  {
    id: 4,
    seller: "Netflix",
    date: "Apr 17, 2023",
    time: "8:00 PM",
    price: "14.99",
    currency: "USD",
  },
];

const App = () => {
  return (
    <>
      <CreditCard
        accountType="Credit Card"
        cardBrand="Visa"
        balance="1000.00"
        transactionNumber="1613000082767244"
      />
      <Transactions transactions={transactions} />
    </>
  );
};

export default App;
