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
    rgb(0, 75, 101) 0%,
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
  border: gray 1px solid;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.4s ease;
  p {
    color: #ff5b5b;
    margin-top: 8px;
  }
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
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const Button = styled.button`
  background-color: #5f6a9b;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  display: block;
  margin: 0px auto;
  margin-top: 1vh;

  &:hover {
    background-color: #8369a3;
  }
`;

function AddBalanceModal({ onAdd, closeModal }) {
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setValue(input);
  };

  const handleTextChange = (event) => {
    const input = event.target.value;
    setTextValue(input);
  };

  const handleClick = () => {
    if (!textValue) {
      setError("Seller/Sender Name is required.");
    } else if (!value) {
      setError("Value is required.");
    } else {
      setError("");
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
      <ModalOverlay show={showModal}>
        <Modal>
          <ModalContent ref={modalRef} show={showModal}>
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
            {error && (
              <p>
                <div>{error}</div>
              </p>
            )}
          </ModalContent>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default AddBalanceModal;
