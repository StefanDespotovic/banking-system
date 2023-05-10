import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, userId, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
