// db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  database: process.env.MYSQL_SCHEMA,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  waitForConnections: true,
  connectionLimit: 10, // Ajuste conforme necessário
  queueLimit: 0,
  multipleStatements: true, // Permite múltiplas declarações SQL
});

export default async function executeQuery({ query, values }) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    return { error };
  }
}
