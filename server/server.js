const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "banking_systems",
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

  const query = "SELECT balance, transaction_number FROM users WHERE id = ?";
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
  const query = "SELECT * FROM transactions WHERE user_id = ?";
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching transactions: ", error);
      res.status(500).json({ error: "Error fetching transactions" });
      return;
    }
    res.json(results);
  });
});

//////////////////////////////////// add balance
app.post("/api/balance", (req, res) => {
  const { userId, sellerSenderName, value } = req.body;

  // Retrieve the current balance and transaction number for the user
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
    const newBalance = balance + value;

    // Update the balance of the user
    const updateBalanceQuery = "UPDATE users SET balance = ? WHERE id = ?";
    const updateBalanceValues = [newBalance, userId];

    connection.query(updateBalanceQuery, updateBalanceValues, (error) => {
      if (error) {
        console.error("Error updating user balance: ", error);
        res.status(500).json({ error: "Error updating user balance" });
        return;
      }

      // Create a new transaction entry
      const createTransactionQuery =
        "INSERT INTO transactions (user_id, seller_sender_name, value, date, time) VALUES (?, ?, ?, CURDATE(), CURTIME())";
      const createTransactionValues = [userId, sellerSenderName, value];

      connection.query(
        createTransactionQuery,
        createTransactionValues,
        (error) => {
          if (error) {
            console.error("Error creating transaction: ", error);
            res.status(500).json({ error: "Error creating transaction" });
            return;
          }
          // Return success response
          res.json({ message: "Balance added successfully" });
        }
      );
    });
  });
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
