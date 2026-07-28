import pg from "pg";
import "./dotenv.js";

const sslEnabled =
  process.env.DB_SSL === "true" || process.env.PGHOST?.includes("render.com");

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
};

export const pool = new pg.Pool(config);
