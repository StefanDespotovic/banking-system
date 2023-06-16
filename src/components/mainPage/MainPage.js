import React, { useContext, useEffect, useState } from "react";
import CreditCard from "../creditCard/CreditCard";
import Transactions from "../transactions/Transactions";
import AddBalance from "../addBalance/AddBalance";
import TransferBalance from "../transferBalance/TransferBalance";
import LineGraph from "../lineGraph/LineGraph";
import Sidebar from "../sidebar/Sidebar";
import { AuthContext } from "../../AuthContext";

import styled, { keyframes } from "styled-components";

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const slideInFromLeft = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 1;
}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.5s ease;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Card = styled.div`
  margin-top: 10vh;
  margin-left: 12vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const History = styled.div`
  margin-top: 5vh;
  margin-left: 12vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const Balance = styled.div`
  margin-top: -75.2vh;
  margin-left: 36vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const Transfer = styled.div`
  margin-top: 5vh;
  margin-left: 36vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;

const LineGraphicon = styled.div`
  margin-top: -73.5vh;
  margin-left: 60vw;

  @media (max-width: 768px) {
    margin-top: 5vh;
    margin-left: 0;
  }
`;
const SideBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.5s ease,
    ${slideInFromLeft} 1s ease-in-out forwards;

  @media (max-width: 768px) {
    opacity: 0;
  }
`;

const Main = () => {
  const { userId } = useContext(AuthContext);
  const [showMain, setShowMain] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    setShowMain(true);
  }, []);

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
      <Wrapper show={showMain}>
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
      <SideBar>
        <Sidebar />
      </SideBar>
    </>
  );
};

export default Main;
