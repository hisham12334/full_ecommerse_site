// backend/src/config/database.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool;

async function connectToDatabase() {
  if (pool) return pool;

  if (!process.env.DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL is not set in backend/.env. Please set your Neon development database URL.");
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

async function initializeTables(dbPool) {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, 
        name TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL, 
        role TEXT DEFAULT 'user', 
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add google_id column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='users' AND column_name='google_id'
        ) THEN
          ALTER TABLE users ADD COLUMN google_id TEXT;
        END IF;
      END $$;
    `);

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY, 
        title TEXT NOT NULL, 
        price INTEGER NOT NULL, 
        images JSONB, 
        description TEXT, 
        category TEXT, 
        colors JSONB, 
        status TEXT DEFAULT 'active', 
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create product_variants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY, 
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, 
        size TEXT NOT NULL, 
        sku TEXT UNIQUE NOT NULL, 
        quantity INTEGER NOT NULL DEFAULT 0, 
        UNIQUE (product_id, size)
      )
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY, 
        user_id INTEGER NOT NULL REFERENCES users(id), 
        items JSONB NOT NULL, 
        total INTEGER NOT NULL, 
        shipping_address JSONB NOT NULL, 
        payment_id TEXT, 
        payment_status TEXT DEFAULT 'pending', 
        order_status TEXT DEFAULT 'pending', 
        razorpay_order_id TEXT, 
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add order cancellation columns if they don't exist
    // 🔴 THIS WAS THE BUG - Missing second $ in DO $$
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='orders' AND column_name='cancelled_at'
        ) THEN
          ALTER TABLE orders 
            ADD COLUMN cancelled_at TIMESTAMPTZ,
            ADD COLUMN cancellation_reason TEXT,
            ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `);

    // Create index for efficient querying of pending orders
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status_created 
      ON orders(order_status, created_at)
    `);

    // Check if any admin exists
    const adminResult = await client.query(
      "SELECT 1 FROM users WHERE role = 'admin'"
    );

    if (adminResult.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('Qadrfits@2025', 10);
      await client.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ['Admin', 'qadr.fits@gmail.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created with email: qadr.fits@gmail.com');
    }

    await client.query('COMMIT');
    console.log('✅ Database schema is verified and up to date.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('🔴 Error initializing tables:', err);
    throw err; // Re-throw to prevent server from starting with broken schema
  } finally {
    client.release();
  }
}

module.exports = { connectToDatabase, initializeTables };