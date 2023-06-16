import React, { useState } from "react";
import AddBalanceModal from "./AddBalanceModal";
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

const Button = styled.button`
  background-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  display: block;
  margin: 0px auto;

  &:hover {
    background-color: #0069d9;
  }
`;

const AddBalance = ({ handleAddBalance }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Wrapper>
      <Title>Add Balance</Title>
      <Button onClick={openModal}>Add Balance</Button>
      {isModalOpen && (
        <AddBalanceModal onAdd={handleAddBalance} closeModal={closeModal} />
      )}
    </Wrapper>
  );
};

export default AddBalance;
