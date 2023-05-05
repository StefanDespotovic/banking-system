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

app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const query = "SELECT * FROM users WHERE id = ?";
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

app.get("/api/transactions", (req, res) => {
  const query = "SELECT * FROM transactions";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching transactions: ", error);
      res.status(500).json({ error: "Error fetching transactions" });
      return;
    }
    res.json(results);
  });
});

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
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
