import React from "react";

const Welcome = ({ toggleLogin }) => {
  return (
    <div>
      <h1>Welcome, please login</h1>
      <button onClick={toggleLogin}>Login</button>
    </div>
  );
};

export default Welcome;
