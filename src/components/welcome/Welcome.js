import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const WelcomeLogin = styled.div`
  background: radial-gradient(circle at 24.1% 68.8%, #5885af 0%, #274472 99.4%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 1.5vh 1.5vw;
  width: 19vw;
  min-height: 8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.5s ease;

  @media (max-width: 768px) {
    width: 75vw;
    padding: 1vh 2vw;
    padding-bottom: 2vh;
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 1.5vh;
  font-size: 28px;

  @media (max-width: 768px) {
    padding-bottom: 0vh;
  }
`;

const LoginButton = styled.button`
  background-color: #194e7f;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  margin-top: 1.5vh;
  padding: 1vh 2vw;

  &:hover {
    background-color: #0075b9;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    margin-top: 1vh;
    padding: 1.5vh 3vw;
  }
`;

const RegisterButton = styled.button`
  background-color: #194e7f;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  margin-top: 1.5vh;
  padding: 1vh 2vw;

  &:hover {
    background-color: #0075b9;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    margin-top: 1.5vh;
    padding: 1.5vh 3vw;
  }
`;

const Welcome = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowWelcome(true);
  }, []);

  const handleLoginClick = () => {
    setShowWelcome(false);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleRegisterClick = () => {
    setShowWelcome(false);
    setTimeout(() => {
      navigate("/register");
    }, 500);
  };
  return (
    <WelcomeLogin show={showWelcome}>
      <Title>Welcome</Title>
      <LoginButton onClick={handleLoginClick}>Login</LoginButton>
      <RegisterButton onClick={handleRegisterClick}>Register</RegisterButton>
    </WelcomeLogin>
  );
};

export default Welcome;
