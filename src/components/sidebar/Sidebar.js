import React, { useContext, useState } from "react";
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
    rgb(50, 50, 50) 0%,
    rgb(0, 0, 0) 99.4%
  );
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const HelpButton = styled.button`
  position: absolute;
  transform: translate(50%, 50%);
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10vh;

  &:hover {
    background-color: #0069d9;
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 5vh;
  }
`;
const LogoutButton = styled.button`
  background-color: rgb(0, 123, 255);
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
    background-color: #0069d9;
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 5vh;
  }
`;

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleLogout } = useContext(AuthContext);

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
      <HelpButton onClick={openModal}>Help</HelpButton>
      {isModalOpen && <HelpModal closeModal={closeModal} />}
    </SideBar>
  );
};

export default Sidebar;
