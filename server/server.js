const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "banking_system",
});

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to database: ", error);
    return;
  }
  console.log("Connected to database!");
});

app.use(bodyParser.json());

//////////////// for testing fetching all users
app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching users: ", error);
      res.status(500).json({ error: "Error fetching users" });
      return;
    }
    res.json(results);
  });
});

////////////////////////// display logged user balance and trn
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const query =
    "SELECT balance, transaction_number, username, id FROM users WHERE id = ?";
  const values = [userId];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error fetching user: ", error);
      res.status(500).json({ error: "Error fetching user" });
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

/////////////// list of transactions history
app.get("/api/transactions", (req, res) => {
  const userId = req.query.user_id;
  const query =
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, time DESC";
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching transactions: ", error);
      res.status(500).json({ error: "Error fetching transactions" });
      return;
    }

    const formattedResults = results.map((result) => {
      const date = new Date(result.date);
      const formattedDate = date.toISOString().split("T")[0];
      return { ...result, date: formattedDate };
    });

    res.json(formattedResults);
  });
});

//////////////////////////////////// add balance
app.post("/api/balance", (req, res) => {
  const { userId, seller_sender_name, value } = req.body;

  // Create a new transaction entry
  const createTransactionQuery =
    "INSERT INTO transactions (user_id, seller_sender_name, value, sign, date, time, current_balance) VALUES (?, ?, ?, ?, CURDATE(), CURTIME(),  (SELECT balance + ? FROM users WHERE id = ?))";
  const createTransactionValues = [
    userId,
    seller_sender_name,
    value,
    "+",
    value,
    userId,
  ];

  connection.query(createTransactionQuery, createTransactionValues, (error) => {
    if (error) {
      console.error("Error creating transaction: ", error);
      res.status(500).json({ error: "Error creating transaction" });
      return;
    }

    // Retrieve the current balance for the user
    const getBalanceQuery = "SELECT balance FROM users WHERE id = ?";
    const getBalanceValues = [userId];

    connection.query(getBalanceQuery, getBalanceValues, (error, results) => {
      if (error) {
        console.error("Error fetching user balance: ", error);
        res.status(500).json({ error: "Error fetching user balance" });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { balance } = results[0];
      const newBalance = parseFloat(balance) + parseFloat(value);

      // Update the balance of the user
      const updateBalanceQuery = "UPDATE users SET balance = ? WHERE id = ?";
      const updateBalanceValues = [newBalance.toFixed(2), userId]; // Format the new balance value with two decimal places

      connection.query(updateBalanceQuery, updateBalanceValues, (error) => {
        if (error) {
          console.error("Error updating user balance: ", error);
          res.status(500).json({ error: "Error updating user balance" });
        } else {
          // Return success response
          res.json({ message: "Balance added successfully" });
        }
      });
    });
  });
});

////////////////////////// Transfer balance
app.post("/api/transfer", (req, res) => {
  const { userId, toAccount, amount, value } = req.body;

  // Retrieve the current balance and transaction number of the logged user
  const getLoggedUserQuery =
    "SELECT balance, transaction_number, username FROM users WHERE id = ?";
  const getLoggedUserValues = [userId];

  connection.query(
    getLoggedUserQuery,
    getLoggedUserValues,
    (error, results) => {
      if (error) {
        console.error("Error fetching logged user data: ", error);
        res.status(500).json({ error: "Error fetching logged user data" });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: "Logged user not found" });
        return;
      }

      const { balance, transaction_number, username } = results[0];
      const transferAmount = parseFloat(amount);

      if (isNaN(transferAmount) || transferAmount <= 0) {
        res.status(400).json({ error: "Invalid transfer amount" });
        return;
      }

      // Check if the logged user has sufficient balance for the transfer
      if (parseFloat(balance) < transferAmount) {
        res.status(400).json({ error: "Insufficient balance for transfer" });
        return;
      }

      // Retrieve the balance and transaction number of the recipient user
      const getRecipientUserQuery =
        "SELECT balance, transaction_number, id FROM users WHERE id = ?";
      const getRecipientUserValues = [toAccount];

      connection.query(
        getRecipientUserQuery,
        getRecipientUserValues,
        (error, recipientResults) => {
          if (error) {
            console.error("Error fetching recipient user data: ", error);
            res
              .status(500)
              .json({ error: "Error fetching recipient user data" });
            return;
          }

          if (recipientResults.length === 0) {
            res.status(404).json({ error: "Recipient user not found" });
            return;
          }

          const recipientBalance = parseFloat(recipientResults[0].balance);
          const recipientTransactionNumber =
            recipientResults[0].transaction_number;

          // Create a new transaction entry for the logged user
          const createLoggedUserTransactionQuery =
            "INSERT INTO transactions (user_id, seller_sender_name, value, sign, date, time, current_balance) VALUES (?, ?, ?, ?, CURDATE(), CURTIME(),  (SELECT balance - ? FROM users WHERE id = ?))";
          const createLoggedUserTransactionValues = [
            userId,
            username,
            transferAmount,
            "-",
            value,
            userId,
          ];

          // Create a new transaction entry for the recipient user
          const createRecipientUserTransactionQuery =
            "INSERT INTO transactions (user_id, seller_sender_name, value, sign, date, time, current_balance) VALUES (?, ?, ?, ?, CURDATE(), CURTIME(),  (SELECT balance + ? FROM users WHERE id = ?))";
          const createRecipientUserTransactionValues = [
            toAccount,
            username,
            transferAmount,
            "+",
            value,
            toAccount,
          ];

          connection.beginTransaction((error) => {
            if (error) {
              console.error("Error starting transaction: ", error);
              res.status(500).json({ error: "Error starting transaction" });
              return;
            }

            // Perform the transaction creation queries within a transaction
            connection.query(
              createLoggedUserTransactionQuery,
              createLoggedUserTransactionValues,
              (error) => {
                if (error) {
                  connection.rollback(() => {
                    console.error(
                      "Error creating logged user transaction: ",
                      error
                    );
                    res.status(500).json({
                      error: "Error creating logged user transaction",
                    });
                  });
                  return;
                }

                connection.query(
                  createRecipientUserTransactionQuery,
                  createRecipientUserTransactionValues,
                  (error) => {
                    if (error) {
                      connection.rollback(() => {
                        console.error(
                          "Error creating recipient user transaction: ",
                          error
                        );
                        res.status(500).json({
                          error: "Error creating recipient user transaction",
                        });
                      });
                      return;
                    }

                    // Update the balances of the logged user and the recipient user
                    const loggedUserNewBalance =
                      parseFloat(balance) - transferAmount;
                    const recipientNewBalance =
                      recipientBalance + transferAmount;

                    // Update the balance of the logged user
                    const updateLoggedUserQuery =
                      "UPDATE users SET balance = ? WHERE id = ?";
                    const updateLoggedUserValues = [
                      loggedUserNewBalance.toFixed(2),
                      userId,
                    ];

                    // Update the balance of the recipient user
                    const updateRecipientUserQuery =
                      "UPDATE users SET balance = ?WHERE id = ?";
                    const updateRecipientUserValues = [
                      recipientNewBalance.toFixed(2),
                      toAccount,
                    ];

                    connection.query(
                      updateLoggedUserQuery,
                      updateLoggedUserValues,
                      (error) => {
                        if (error) {
                          connection.rollback(() => {
                            console.error(
                              "Error updating logged user: ",
                              error
                            );
                            res
                              .status(500)
                              .json({ error: "Error updating logged user" });
                          });
                          return;
                        }

                        connection.query(
                          updateRecipientUserQuery,
                          updateRecipientUserValues,
                          (error) => {
                            if (error) {
                              connection.rollback(() => {
                                console.error(
                                  "Error updating recipient user: ",
                                  error
                                );
                                res
                                  .status(500)
                                  .json({
                                    error: "Error updating recipient user",
                                  });
                              });
                              return;
                            }

                            connection.commit((error) => {
                              if (error) {
                                connection.rollback(() => {
                                  console.error(
                                    "Error committing transaction: ",
                                    error
                                  );
                                  res.status(500).json({
                                    error: "Error committing transaction",
                                  });
                                });
                                return;
                              }

                              res
                                .status(200)
                                .json({ message: "Transfer successful" });
                            });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          });
        }
      );
    }
  );
});

//////////////////////// login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  const values = [username, password];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error fetching user: ", error);
      res.status(500).json({ error: "Error fetching user" });
      return;
    }

    if (results.length > 0) {
      res.json({ userId: results[0].id });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
