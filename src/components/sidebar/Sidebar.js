import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import HelpModal from "./HelpModal";
import styled from "styled-components";

const SideBar = styled.div`
  position: absolute;
  width: 10vw;
  height: 100vh;
  background: radial-gradient(
    circle at 24.1% 68.8%,
    #122543 0%,
    rgb(0, 0, 0) 99.4%
  );
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  p {
    margin-top: 4vh;
    margin-left: 2vw;
    color: white;
    font-size: 20px;
  }

  @media (max-width: 768px) {
    position: absolute;
    width: 100vw;
    height: 8vh;
    background: radial-gradient(
      circle at 24.1% 68.8%,
      #122543 0%,
      rgb(0, 0, 0) 99.4%
    );
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    p {
      opacity: 0;
    }
  }
`;

const HelpButton = styled.button`
  position: absolute;
  transform: translate(50%, 50%);
  background-color: transparent;
  color: gray;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 90vh;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #ffffff;
    transform: translateX(-100%);
    animation: underline 2s infinite;
  }

  @media (max-width: 768px) {
    position: absolute;
    transform: translate(50%, 50%);
    margin-top: 0vh;
    margin-left: 68vw;
  }

  &:hover::after {
    animation-play-state: paused;
  }

  @keyframes underline {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const LogoutButton = styled.button`
  background-color: RGB(0, 60, 95);
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  display: block;
  margin: 0px auto;
  margin-top: 2vh;

  &:hover {
    background-color: #0075b9;
  }

  @media (max-width: 768px) {
    position: absolute;
    transform: translate(50%, 50%);
    margin-top: 0vh;
    margin-left: -3vw;
  }
`;

const Sidebar = ({ userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;
      setCurrentTime(time);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <SideBar>
      <LogoutButton onClick={handleLogoutClick}>Logout</LogoutButton>
      <p>Hello {`${userData.name}`}</p>
      <p style={{ marginLeft: "2.3vw", marginTop: "1vh" }}>{currentTime}</p>
      <HelpButton onClick={openModal}>Help?</HelpButton>
      {isModalOpen && <HelpModal closeModal={closeModal} />}
    </SideBar>
  );
};

export default Sidebar;
