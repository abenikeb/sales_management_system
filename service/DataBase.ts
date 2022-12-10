import { Pool } from "pg";
require("dotenv").config();

// local DB Connect

// const pool = new Pool({
//   user: process.env.DB_USER as string,
//   password: process.env.DB_PASSWORD as string,
//   host: process.env.DB_HOST as string,
//   port: process.env.DB_PORT as any,
//   database: process.env.DB_NAME as string,
// });

// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("Error acquiring client", err.stack);
//   }
// });

// HEROKU DB Connect

const { Client } = require("pg");

const pool = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect();

// pool.query(
//   "SELECT table_schema,table_name FROM information_schema.tables;",
//   (err: any, res: any) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     pool.end();
//   }
// );

export default pool;
