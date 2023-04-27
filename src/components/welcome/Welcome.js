import React from "react";

const Welcome = ({ toggleLogin }) => {
  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={toggleLogin}>Login</button>
    </div>
  );
};

export default Welcome;
