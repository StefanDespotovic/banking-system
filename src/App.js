import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Main from "./components/mainPage/MainPage";
import Welcome from "./components/welcome/Welcome";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login onLogin={setLoggedIn} />} />
        {!loggedIn && <Route to="/login" />}
        {loggedIn && (
          <>
            <Route path="/main" element={<Main />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
