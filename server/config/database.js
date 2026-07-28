import pg from "pg";
import "./dotenv.js";

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

export const pool = new pg.Pool(config);
