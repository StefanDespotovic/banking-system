import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeAnimation = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
    `;
const ModalContent = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(0, 35, 95) 0%,
    rgb(0, 0, 0) 99.4%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  width: 21vw;
  min-height: 24rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 70vh;
  border: gray 1px solid;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.4s ease;
  overflow-y: scroll;

  /* Hide the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  /* WebKit */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  @media (max-width: 768px) {
    width: 75vw;
    padding: 1vh 3vw;
    padding-bottom: 3vh;
  }
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;
const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vh;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -1vh;
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
  font-size: 16px;
  font-weight: bold;
`;

const Date = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const Price = styled.div`
  font-size: 16px;
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
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
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
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0075b9;
  }
`;
function TransactionsModal({ closeModal, transactions }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setShowModal(true);
  }, []);

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
      <ModalOverlay show={showModal}>
        <Modal>
          <ModalContent ref={modalRef} show={showModal}>
            <Title>Transaction History</Title>
            {transactions.length > 0 ? (
              <TransactionList>
                {transactions?.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id}
                    last={index === transactions.length - 1}
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
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default TransactionsModal;
