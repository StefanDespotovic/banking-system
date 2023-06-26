const mysql = require("mysql2");

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to database: ", error);
    return;
  }
  console.log("Connected to database!");
});

module.exports = connection;
