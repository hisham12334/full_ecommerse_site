// backend/src/config/database.js
const { Pool } = require('pg');

let pool;

async function connectToDatabase() {
  if (pool) return pool;

  if (!process.env.DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL is not set in backend/.env.");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Connection Pool Established.');
    client.release();
    return pool;
  } catch (error) {
    console.error('🔴 FATAL: Database connection failed.', error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };