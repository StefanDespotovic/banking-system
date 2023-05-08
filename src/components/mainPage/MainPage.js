import React, { useState, useEffect } from "react";
import CreditCard from "../creditCard/CreditCard";
import Transactions from "../transactions/Transactions";
import AddBalance from "../addBalance/AddBalance";

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

const Main = ({ userId }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users?id=${userId}`
        );
        if (response.ok) {
          const user = await response.json();
          console.log("User data: ", user);
          setBalance(user.balance);
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error connecting to server", error);
      }
    };

    const fetchTransactionsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/transactions?user_id=${userId}`
        );
        if (response.ok) {
          const transactions = await response.json();
          console.log("Transactions data: ", transactions);
          setTransactions(transactions);
        } else {
          console.error("Error fetching transactions data");
        }
      } catch (error) {
        console.error("Error connecting to server", error);
      }
    };

    fetchUserData();
    fetchTransactionsData();
  }, [userId]);

  return (
    <>
      <Card>
        <CreditCard
          accountType="Credit Card"
          cardBrand="Visa"
          balance={balance}
          transaction_number=""
        />
      </Card>
      <History>
        <Transactions transactions={transactions} />
      </History>
      <Balance>
        <AddBalance setBalance={setBalance} />
      </Balance>
    </>
  );
};

export default Main;
