import React, { useContext, useEffect, useState } from "react";
import CreditCard from "../creditCard/CreditCard";
import Transactions from "../transactions/Transactions";
import AddBalance from "../addBalance/AddBalance";
import TransferBalance from "../transferBalance/TransferBalance";
import LineGraph from "../lineGraph/LineGraph";
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
const Transfer = styled.div`
  position: relative;
  margin-left: 30vw;
  bottom: 32vh;
`;
const Main = () => {
  const { userId } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        setError("Error fetching user data");
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
    } finally {
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
        setTransactions(transactions);
      } else {
        setError("Error fetching transactions data");
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => {
      fetchUserData();
      fetchTransactionsData();
    }, // eslint-disable-next-line
    [userId, triggerFetch]
  );

  const handleAddBalance = async (value, seller_sender_name) => {
    setLoading(true); // Set loading state to true before making the request

    const numericValue = parseFloat(value).toFixed(2);

    try {
      if (!seller_sender_name) {
        setError("Seller/Sender Name is required.");
        setLoading(false); // Set loading state to false when an error occurs
        return;
      }

      const response = await fetch("http://localhost:5000/api/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          value: numericValue,
          seller_sender_name,
        }),
      });

      if (response.ok) {
        fetchUserData(); // Refresh user data and transaction history
        fetchTransactionsData();
      } else {
        const data = await response.json();
        setError("Error adding balance: " + data.error);
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false); // Set loading state to false after the request is complete
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
      <Transfer>
        <TransferBalance
          userData={userData}
          setTriggerFetch={setTriggerFetch}
        />
      </Transfer>
      <div>
        <LineGraph userData={userData} />
      </div>
    </>
  );
};

export default Main;
