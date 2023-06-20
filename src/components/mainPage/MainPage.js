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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.5s ease;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10vh;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CardHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 12vw;
  margin-right: 6vw;
  margin-bottom: 2vh;

  @media (max-width: 768px) {
    margin: 0 auto;
    max-width: 90vw;
    margin-bottom: 2vh;
  }
`;

const Card = styled.div`
  margin-bottom: 2vh;
`;

const History = styled.div``;

const BalanceTransferWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: -2vw;
  margin-right: 4vw;
  margin-bottom: 2vh;

  @media (max-width: 768px) {
    margin: 0 auto;
    max-width: 90vw;
    margin-bottom: 2vh;
  }
`;

const Balance = styled.div`
  margin-bottom: 2vh;
`;

const Transfer = styled.div``;

const LineGraphWrapper = styled.div`
  margin-bottom: 2vh;

  @media (max-width: 768px) {
    margin: 0 auto;
    max-width: 90vw;
    margin-bottom: 2vh;
  }
`;

const SideBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.5s ease;
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

  useEffect(() => {
    fetchUserData();
    fetchTransactionsData();
  }, [userId, triggerFetch]);

  const handleAddBalance = async (value, seller_sender_name) => {
    setLoading(true);

    const numericValue = parseFloat(value).toFixed(2);

    try {
      if (!seller_sender_name) {
        setError("Seller/Sender Name is required.");
        setLoading(false);
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
        fetchUserData();
        fetchTransactionsData();
      } else {
        const data = await response.json();
        setError("Error adding balance: " + data.error);
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
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
        <ContentWrapper>
          <CardHistoryWrapper>
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
          </CardHistoryWrapper>
          <BalanceTransferWrapper>
            <Balance>
              <AddBalance handleAddBalance={handleAddBalance} />
            </Balance>
            <Transfer>
              <TransferBalance
                userData={userData}
                setTriggerFetch={setTriggerFetch}
              />
            </Transfer>
          </BalanceTransferWrapper>
          <LineGraphWrapper>
            <LineGraph userData={userData} />
          </LineGraphWrapper>
        </ContentWrapper>
      </Wrapper>
      <SideBar show={showMain}>
        <Sidebar userData={userData} />
      </SideBar>
    </>
  );
};

export default Main;
