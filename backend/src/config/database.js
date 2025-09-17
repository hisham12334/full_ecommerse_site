const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
  }

  connect() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('Successfully connected to PostgreSQL database.');
    this.initializeTables();
    return this.pool;
  }

  async initializeTables() {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Users table (no changes)
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`);

      // Products table (now simplified to hold general product info)
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          price INTEGER NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          category TEXT,
          colors JSONB, -- Colors can still be general to the product
          status TEXT DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`);

      // NEW: product_variants table for size-specific inventory
      await client.query(`
        CREATE TABLE IF NOT EXISTS product_variants (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          size TEXT NOT NULL, -- S, M, L
          sku TEXT UNIQUE NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          UNIQUE (product_id, size) -- Ensures a product can't have two "S" sizes
        )`);

      // Orders table (no changes to structure, but we'll use it differently)
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
        )`);

      // Create admin user if not exists
      const adminResult = await client.query("SELECT * FROM users WHERE email = 'admin@admin.com'");
      if (adminResult.rows.length === 0) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
          ['Admin', 'admin@admin.com', hashedPassword, 'admin']);
        console.log('Admin user created.');
      }
      
      await client.query('COMMIT');
      console.log('Professional database schema is set up.');

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error initializing tables:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  getDb() {
    return this.pool;
  }
}

module.exports = new Database();