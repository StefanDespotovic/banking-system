import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WelcomeLogin = styled.div`
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

const Title = styled.h1`
  color: white;
  margin-bottom: 16px;
`;

const LoginButton = styled.button`
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  margin-top: 16px;
  padding: 8px 16px;

  &:hover {
    background-color: #0069d9;
  }
`;

const Welcome = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <WelcomeLogin>
      <Title>Welcome</Title>
      <LoginButton onClick={handleLoginClick}>Login</LoginButton>
    </WelcomeLogin>
  );
};

export default Welcome;
