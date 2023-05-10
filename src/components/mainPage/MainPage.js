import React, { useContext, useEffect, useState } from "react";
import CreditCard from "../creditCard/CreditCard";
import Transactions from "../transactions/Transactions";
import AddBalance from "../addBalance/AddBalance";
import { AuthContext } from "../../AuthContext";
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
const Main = () => {
  const { userId } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } else {
        setError("Error fetching user data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
      setLoading(false);
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
        setError("Error fetching transactions data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTransactionsData();
  }, [userId]);

  const handleAddBalance = async (value, seller_sender_name) => {
    try {
      if (!seller_sender_name) {
        setError("Seller/Sender Name is required.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          value,
          seller_sender_name,
        }),
      });

      if (response.ok) {
        // Refresh user data and transaction history
        fetchUserData();
        fetchTransactionsData();
      } else {
        setError("Error adding balance");
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Card>
        <CreditCard
          accountType="Credit Card"
          cardBrand="Visa"
          balance={userData.balance}
          transaction_number={userData.transaction_number}
        />
      </Card>
      <History>
        <Transactions transactions={transactions} />
      </History>
      <Balance>
        <AddBalance handleAddBalance={handleAddBalance} />
      </Balance>
    </>
  );
};

export default Main;
