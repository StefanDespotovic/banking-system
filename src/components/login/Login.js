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

const LoginModal = styled.div`
  background: radial-gradient(circle at 24.1% 68.8%, #5885af 0%, #274472 99.4%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 2vh 2vw;
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
  animation: ${fadeAnimation} 0.4s ease;
  @media (max-width: 768px) {
    width: 75vw;
    padding: 1vh 3vw;
    padding-top: 3vh;
    padding-bottom: 3vh;
  }
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
  margin-bottom: 1.5vh;
  width: 100%;
  color: white;

  & > span {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 0.8vh;
  }

  & > input {
    border: none;
    border-radius: 4px;
    padding: 0.8vh;
    width: 100%;
    font-size: 16px;
  }
`;

const Button = styled.button`
  background-color: #194e7f;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 0.8vh 1.6vw;
  cursor: pointer;
  display: block;
  margin: 0px auto;

  &:hover {
    background-color: #0075b9;
  }
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 1.5vh 3vw;
  }
`;

const Error = styled.div`
  color: #ff8080;
  margin-top: 0.8vh;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1vh;
  left: 1vw;
  background-color: #194e7f;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 0.8vh 1.6vw;
  cursor: pointer;

  &:hover {
    background-color: #0075b9;
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 5vh;
    width: 20vw;
  }
`;

const WarningBox = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 0.5rem;
  margin-top: 2rem;
  width: 100%;
  text-align: center;
  color: white;
  overflow-wrap: break-word;
`;
const Description = styled.p`
  font-size: 16px;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setShowLogin(true);
    setLoginError("");
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = formValues;
    const validationError = validateForm(username, password);
    if (validationError) {
      setLoginError(validationError);
      return;
    }
    setLoginError("");

    try {
      const response = await fetch(
        `https://banking-system-jllp.onrender.com/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        handleLogin(data.userId);
        navigate("/main");
      } else {
        const data = await response.json();
        setLoginError(data.error);
      }
    } catch (error) {
      console.error("Error connecting to server", error);
      setLoginError("Error connecting to server. Please try again.");
    }
  };

  const validateForm = (username, password) => {
    if (!username || !password) {
      return "Please enter both username and password.";
    }
    return null;
  };

  const handleBack = () => {
    setShowLogin(false);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <>
      <LoginModal show={showLogin}>
        <Description>
          Username: test <br></br>Password: test
        </Description>
        <Form onSubmit={handleSubmit}>
          {loginError && <Error>{loginError}</Error>}
          <Label>
            <span>Username:</span>
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
            />
          </Label>
          <Label>
            <span>Password:</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
          </Label>
          <Button type="submit">Login</Button>
        </Form>
        <WarningBox>
          Because the server is using slow resources, it may take a little
          longer to connect.
        </WarningBox>
      </LoginModal>
      <BackButton onClick={handleBack}>Return</BackButton>
    </>
  );
};

export default Login;
