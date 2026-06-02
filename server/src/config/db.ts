import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log(
  process.env.DATABASE_URL?.substring(0, 30)
);

console.log(
  "DATABASE_URL FOUND:",
  !!process.env.DATABASE_URL
);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;