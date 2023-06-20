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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  border: gray 1px solid;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.4s ease;
`;

const Title = styled.h2`
  font-size: 2.5vh;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 2vh;
  margin-top: 10px;
  text-align: center;
`;

const BulletList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
`;

const BulletListItem = styled.li`
  margin-bottom: 1vh;
  &::after {
    content: "";
    display: block;
    height: 1px;
    background-color: white;
    margin-top: 2vh;
  }

  &:last-child::after {
    display: none;
  }
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
  background-color: RGB(0, 60, 95);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 2vh;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0075b9;
  }
`;

function HelpModal({ closeModal }) {
  const [showHelp, setShowHelp] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setShowHelp(true);
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
      <ModalOverlay>
        <Modal>
          <ModalContent ref={modalRef} show={showHelp}>
            <Title>Help</Title>
            <Description>
              <BulletList>
                <BulletListItem>
                  The creation of this project took place as part of the
                  educational experience focused on React and Node.js
                </BulletListItem>
                <BulletListItem>
                  You can transfer money from your private account to someone
                  else's account after selecting from a list.
                </BulletListItem>
                <BulletListItem>
                  You can send as much money as you currently have in your
                  balance.
                </BulletListItem>
                <BulletListItem>
                  You can add money to your balance for further testing.
                </BulletListItem>
                <BulletListItem>
                  You can log out of your account and log in again.
                </BulletListItem>
                <BulletListItem>
                  By hovering over the dots in the line graph, you can see the
                  balance at the time of each transaction.
                </BulletListItem>
              </BulletList>
            </Description>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default HelpModal;
