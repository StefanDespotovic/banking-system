import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const ModalContent = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(50, 50, 50) 0%,
    rgb(0, 0, 0) 99.4%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
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
  margin-left: 4vw !important;
  margin-right: 0.3vw !important;
`;

const Currency = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const Modal = styled.div`
  display: relative;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0069d9;
  }
`;
function TransactionsModal({ closeModal, transactions }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <ModalOverlay>
        <Modal>
          <ModalContent ref={modalRef}>
            <Title>Transaction History</Title>
            <TransactionList>
              {transactions?.map((transaction) => (
                <TransactionItem key={transaction.id}>
                  <div>
                    <SellerName>{transaction.seller_sender_name}</SellerName>
                    <Date>{`${transaction.date} ${transaction.time}`}</Date>
                  </div>
                  <div>
                    <Price>-{transaction.value}</Price>
                    <Currency>USD</Currency>
                  </div>
                </TransactionItem>
              ))}
            </TransactionList>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default TransactionsModal;
