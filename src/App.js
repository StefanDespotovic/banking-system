import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Main from "./components/mainPage/MainPage";
import Welcome from "./components/welcome/Welcome";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (userId, username, password) => {
    setLoggedIn(true);
    setUserId(userId);
    setUsername(username);
    setPassword(password);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {!loggedIn && <Route to="/login" />}
        {loggedIn && (
          <>
            <Route path="/main" element={<Main userId={userId} />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
