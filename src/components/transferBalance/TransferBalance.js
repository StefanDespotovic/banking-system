import React, { useState } from "react";

const TransferBalance = ({ userData }) => {
  const [fromAccount, setFromAccount] = useState(
    `${userData.username} ${userData.transaction_number}`
  );
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = () => {
    console.log("Transfer initiated!");
    console.log("From Account:", fromAccount);
    console.log("To Account:", toAccount);
    console.log("Amount:", amount);

    setFromAccount("");
    setToAccount("");
    setAmount("");
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
        <input
          type="text"
          id="toAccount"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
        />

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
      </form>
    </div>
  );
};

export default TransferBalance;
