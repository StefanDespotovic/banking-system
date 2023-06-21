import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TransferBalanceCard = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(0, 35, 95) 0%,
    rgb(0, 0, 0) 99.4%
  );
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  padding-bottom: 2vh;
  width: 19vw;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 75vw;
    padding: 1vh 3vw;
    padding-bottom: 3vh;
  }
  h2 {
    font-size: 2.5vh;
    font-weight: bold;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
      margin-bottom: 0.5vh;
      align-items: center;
      font-size: 2vh;
    }

    input,
    select {
      padding: 0.5vh;
      border-radius: 4px;
      border: 1px solid #ccc;
      margin-bottom: 16px;
      font-size: 2vh;
      align-items: center;
    }

    button {
      background-color: RGB(0, 60, 95);
      color: rgb(255, 255, 255);
      border: none;
      border-radius: 5px;
      font-size: 2vh;
      padding: 8px 16px;
      cursor: pointer;
      display: block;
      margin: 0px auto;
      align-items: center;
      margin-top: 2vh;

      &:hover {
        background-color: #0075b9;
      }
    }

    p {
      color: #ff5b5b;
      margin-top: 2vh;
    }
  }
`;
const TransferBalance = ({ userData, setTriggerFetch }) => {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [userList, setUserList] = useState([]);
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false); // New state variable

  const handleTransfer = async () => {
    setTransferSuccess(false);
    setTransferError("");
    console.log("Transfer initiated!");
    console.log("From Account:", fromAccount);
    console.log("To Account:", toAccount);
    console.log("Amount:", amount);

    try {
      const selectedUserId = toAccount.split(" ")[2];
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        console.error("Invalid transfer amount");
        setTransferError("Invalid transfer amount");
        return;
      }
      const response = await fetch("http://localhost:5000/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          toAccount: selectedUserId,
          amount: transferAmount,
          value: transferAmount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Transfer successful");

        setTriggerFetch((prev) => !prev);
        setTransferSuccess(true);
        // Perform any additional actions after successful transfer
      } else {
        console.error("Transfer failed");
        const errorData = await response.json();
        setTransferError(errorData.error);
        // Handle transfer failure
      }
    } catch (error) {
      console.error("Error connecting to server", error);
    }

    setToAccount("");
    setAmount("");
  };

  useEffect(() => {
    if (userData) {
      setFromAccount(`${userData.username} ${userData.transaction_number} `);
    }
    fetchUserList();
  }, [userData]);

  const fetchUserList = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (response.ok) {
        const data = await response.json();
        const filteredUserList = data.filter(
          (user) => user.username !== userData.username
        );
        setUserList(filteredUserList);
      } else {
        console.error("Error fetching user list");
      }
    } catch (error) {
      console.error("Error connecting to server", error);
    }
  };

  return (
    <TransferBalanceCard>
      <h2>Transfer Balance</h2>
      <form>
        <label htmlFor="fromAccount">From Account:</label>
        <input
          type="text"
          id="fromAccount"
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          readOnly
        />

        <label htmlFor="toAccount">To Account:</label>
        <select
          id="toAccount"
          value={toAccount}
          onChange={(e) => {
            console.log("Selected To Account:", e.target.value);
            setToAccount(e.target.value);
          }}
        >
          <option value="">Select an account</option>
          {userList.map((user) => (
            <option
              key={user.id}
              value={`${user.username} ${user.transaction_number} ${user.id}`}
            >
              {`${user.username} ${user.transaction_number}`}
            </option>
          ))}
        </select>

        <label htmlFor="amount">Amount:</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="button" onClick={handleTransfer}>
          Transfer
        </button>
        {transferError && <p>{transferError}</p>}
        {transferSuccess && (
          <p style={{ color: "green" }}>Transfer successful!</p>
        )}
      </form>
    </TransferBalanceCard>
  );
};

export default TransferBalance;
