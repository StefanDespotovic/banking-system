import React, { useState, useEffect } from "react";

const TransferBalance = ({ userData, setTriggerFetch }) => {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [userList, setUserList] = useState([]);
  const [transferError, setTransferError] = useState("");

  const handleTransfer = async () => {
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Transfer successful");

        setTriggerFetch((prev) => !prev);

        // Perform any additional actions after successful transfer
      } else {
        console.error("Transfer failed");
        const errorData = await response.json();
        setTransferError(errorData.error);
        // Handle transfer failure
      }
      localStorage.removeItem("fromAccount");
    } catch (error) {
      console.error("Error connecting to server", error);
    }

    setToAccount("");
    setAmount("");
  };

  useEffect(() => {
    if (userData) {
      setFromAccount(
        `${userData.username} ${userData.transaction_number} ${userData.id}`
      );
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
    <div>
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
              {`${user.username} (${user.transaction_number}) ${user.id}`}
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
      </form>
    </div>
  );
};

export default TransferBalance;
