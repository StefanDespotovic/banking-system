import React, { useContext, useEffect, useState } from "react";
import CreditCard from "../creditCard/CreditCard";
import Transactions from "../transactions/Transactions";
import AddBalance from "../addBalance/AddBalance";
import TransferBalance from "../transferBalance/TransferBalance";
import LineGraph from "../lineGraph/LineGraph";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Card = styled.div`
  margin-top: 10vh;
  margin-left: 3vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const History = styled.div`
  margin-top: 5vh;
  margin-left: 3vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const Balance = styled.div`
  margin-top: -75.2vh;
  margin-left: 30vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const Transfer = styled.div`
  margin-top: 5vh;
  margin-left: 30vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const LineGraphicon = styled.div`
  margin-top: -72.4vh;
  margin-left: 55vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 1vh;
  left: 1vw;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #0069d9;
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 5vh;
  }
`;

const Main = () => {
  const { userId } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { handleLogout } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

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
      <Wrapper>
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
        <LineGraphicon>
          <LineGraph userData={userData} />
        </LineGraphicon>
      </Wrapper>
      <LogoutButton onClick={handleLogoutClick}>Logout</LogoutButton>
    </>
  );
};

export default Main;
