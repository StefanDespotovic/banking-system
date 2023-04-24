import React, { useState } from "react";
import TransactionsModal from "./Modal";
import styled from "styled-components";

const Wrapper = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(50, 50, 50) 0%,
    rgb(0, 0, 0) 99.4%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  padding-bottom: 3vw;
  width: 300px;
  height: auto;
  color: white;
`;

const Title = styled.h2`
  font-size: 24px;
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

  div:last-child {
    display: flex;
    align-items: center;
  }
`;

const SellerName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Date = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-right: 5px;
`;

const Currency = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  display: block;
  margin: 0 auto;

  &:hover {
    background-color: #0069d9;
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
      <TransactionList>
        {recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id}>
            <div>
              <SellerName>{transaction.seller}</SellerName>
              <Date>{`${transaction.date} ${transaction.time}`}</Date>
            </div>
            <div>
              <Price>{-transaction.price}</Price>
              <Currency>{transaction.currency}</Currency>
            </div>
          </TransactionItem>
        ))}
      </TransactionList>
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
