import React, { useState } from "react";
import TransactionsModal from "./Modal";
import styled from "styled-components";

const Wrapper = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(0, 35, 95) 0%,
    rgb(0, 0, 0) 99.4%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  padding-bottom: 3vh;
  width: 19vw;
  height: auto;
  color: white;
  @media (max-width: 768px) {
    width: 75vw;
    padding: 1vh 3vw;
    padding-bottom: 3vh;
  }
`;

const Title = styled.h2`
  font-size: 2.5vh;
  font-weight: bold;
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: white;
    opacity: ${(props) => (props.last ? 0 : 1)};
  }

  div:last-child {
    display: flex;
    align-items: center;
  }
`;

const SellerName = styled.div`
  font-size: 2vh;
  font-weight: bold;
`;

const Date = styled.div`
  font-size: 1.6vh;
  color: #6c757d;
`;

const Price = styled.div`
  font-size: 2.2vh;
  font-weight: bold;
  margin-right: 5px;
`;

const Currency = styled.div`
  font-size: 1.6vh;
  color: #6c757d;
`;
const History = styled.div`
  text-align: center;
  color: #6c757d;
  margin-bottom: 2vh;
`;

const Button = styled.button`
  background-color: RGB(0, 60, 95);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 2vh;
  padding: 8px 16px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  margin-top: 6vh;

  &:hover {
    background-color: #0075b9;
  }
`;

const Transactions = ({ transactions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recentTransactions = transactions.slice(0, 3);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Wrapper>
      <Title>Transaction History</Title>
      {recentTransactions.length > 0 ? (
        <TransactionList>
          {recentTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              last={index === recentTransactions.length - 1}
            >
              <div>
                <SellerName>{transaction.seller_sender_name}</SellerName>
                <Date>{`${transaction.date} ${transaction.time}`}</Date>
              </div>
              <div>
                <Price>
                  {transaction.sign}
                  {transaction.value}
                </Price>
                <Currency>USD</Currency>
              </div>
            </TransactionItem>
          ))}
        </TransactionList>
      ) : (
        <History>No transaction history available.</History>
      )}
      <Button onClick={openModal}>See All Transactions</Button>
      {isModalOpen && (
        <TransactionsModal
          transactions={transactions}
          closeModal={closeModal}
        />
      )}
    </Wrapper>
  );
};

export default Transactions;
