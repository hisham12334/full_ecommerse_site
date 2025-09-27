// backend/migrate.js
require('dotenv').config();
const { Pool } = require('pg');

// Ensure this script uses the DATABASE_URL from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateDatabase() {
  const client = await pool.connect();
  try {
    console.log('Starting database schema migration...');

    // Check if the old 'image' column exists
    const columnCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='products' AND column_name='image';
    `);

    if (columnCheck.rows.length > 0) {
      console.log("Old 'image' column found. Beginning migration...");
      await client.query('BEGIN');

      // 1. Add the new 'images' column with JSONB type
      await client.query('ALTER TABLE products ADD COLUMN images JSONB;');
      console.log("Step 1/3: 'images' column added.");

      // 2. Copy data from the old 'image' column into the new 'images' column, wrapping it in a JSON array
      await client.query(`UPDATE products SET images = jsonb_build_array(image) WHERE image IS NOT NULL;`);
      console.log("Step 2/3: Data copied to new 'images' column.");

      // 3. Drop the old 'image' column
      await client.query('ALTER TABLE products DROP COLUMN image;');
      console.log("Step 3/3: Old 'image' column dropped.");

      await client.query('COMMIT');
      console.log('✅ Migration successful! Your database is now up to date.');
    } else {
      console.log('✅ Schema is already up to date. No migration needed.');
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('🔴 Migration failed:', err);
  } finally {
    await client.release();
    await pool.end();
  }
}

migrateDatabase();