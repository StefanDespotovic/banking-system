import React, { createContext, useState, useEffect } from "react";
console.clear();
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Check if the user is already logged in
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
    localStorage.setItem("userId", userId); // Store the userId in localStorage
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId("");
    localStorage.removeItem("userId"); // Remove the stored userId from localStorage
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, userId, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
