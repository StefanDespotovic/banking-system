require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.DATA_PORT || 3306;

const connection = require("./db");

app.use(bodyParser.json());

const userRoutes = require("./userRoutes");
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
