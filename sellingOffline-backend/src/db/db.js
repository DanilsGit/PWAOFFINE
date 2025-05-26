import pg from "pg";
import { config } from "../config/config.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};
