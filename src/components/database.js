const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "banking_system",
});

async function getUsers(username, password) {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}
