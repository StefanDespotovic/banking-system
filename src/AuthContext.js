import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Stored User ID:", storedUserId); // Add this console log

    if (storedUserId) {
      setLoggedIn(true);
      setUserId(storedUserId);
      console.log("User ID set:", storedUserId); // Add this console log
    }
  }, []);

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
    localStorage.setItem("userId", userId);
    console.log("User logged in:", userId); // Add this console log
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId("");
    localStorage.removeItem("userId");
    console.log("User logged out"); // Add this console log
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
