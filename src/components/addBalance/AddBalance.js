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
const AddBalance = ({ handleAddBalance }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const [sellerSenderName, setSellerSenderName] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handlesellerSenderNameChange = (event) => {
    setSellerSenderName(event.target.value);
  };

  const handleAddBalanceClick = () => {
    if (value && sellerSenderName) {
      handleAddBalance(parseFloat(value), sellerSenderName);
      closeModal();
      setValue("");
      setSellerSenderName("");
    }
  };

  return (
    <Wrapper>
      <Title>Add Balance</Title>
      <Button onClick={openModal}>Add Balance</Button>
      {isModalOpen && (
        <div>
          <input
            type="text"
            value={sellerSenderName}
            onChange={handlesellerSenderNameChange}
          />
          <input type="number" value={value} onChange={handleChange} />
          <button onClick={handleAddBalanceClick}>Add Balance</button>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </Wrapper>
  );
};

export default AddBalance;
