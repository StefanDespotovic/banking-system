import React, { useEffect, useRef, useState } from "react";
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

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
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
  background-color: rgba(0, 0, 0, 0.5);
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

function AddBalanceModal({ onAdd, closeModal }) {
  const [value, setValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const handleChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setValue(input);
  };

  const handleTextChange = (event) => {
    const input = event.target.value;
    setTextValue(input);
  };

  const handleClick = () => {
    if (value || textValue) {
      // Call the onAdd function to update the balance and add a new transaction
      onAdd(parseFloat(value), textValue);
      closeModal();
      setValue("");
      setTextValue("");
    }
  };

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
            <Title>Add Balance</Title>
            <input
              type="text"
              value={textValue}
              onChange={handleTextChange}
              placeholder="Seller/Sender Name"
            />
            <input
              type="number"
              step="any"
              value={value}
              onChange={handleChange}
              placeholder="Value"
            />
            <Button onClick={handleClick}>Add Balance</Button>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default AddBalanceModal;
