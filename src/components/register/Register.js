import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import styled, { keyframes } from "styled-components";

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const RegisterModal = styled.div`
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
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${fadeAnimation} 0.8s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
  width: 100%;
  color: white;

  & > span {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  & > input {
    border: none;
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    font-size: 14px;
  }
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
const BackButton = styled.button`
  position: absolute;
  top: 1vh;
  left: 1vw;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #0069d9;
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 5vh;
  }
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState(null);
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setShowRegister(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!username || !password || !reenterPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== reenterPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        handleLogin(data.userId);
        navigate("/main");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setError("Error connecting to server. Please try again.");
    }
  };
  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <RegisterModal show={showRegister}>
        <Form onSubmit={handleSubmit}>
          {error && <span>{error.message}</span>}
          <Label>
            <span>Username:</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              minLength={6}
              required
            />
          </Label>
          <Label>
            <span>Password:</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </Label>
          <Label>
            <span>Reenter Password:</span>
            <input
              type="password"
              value={reenterPassword}
              onChange={(event) => setReenterPassword(event.target.value)}
              required
            />
          </Label>
          {password !== reenterPassword && (
            <span style={{ color: "white" }}>Passwords do not match.</span>
          )}
          <Button type="submit">Register</Button>
        </Form>
      </RegisterModal>
      <BackButton onClick={handleBack}>Return</BackButton>
    </>
  );
};

export default Register;
