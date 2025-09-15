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

      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`);

      // Products table
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          price INTEGER NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          category TEXT,
          sizes JSONB,
          colors JSONB,
          stock_quantity INTEGER DEFAULT 100,
          sku TEXT UNIQUE,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`);

      // Orders table
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

      // Insert sample products if table is empty
      const productsResult = await client.query("SELECT COUNT(*) as count FROM products");
      if (productsResult.rows[0].count === '0') {
        console.log('No products found, inserting sample data...');
        await this.insertSampleProducts(client);
      }

      await client.query('COMMIT');
      console.log('Database tables are set up and verified.');

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error initializing tables:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async insertSampleProducts(client) {
    const sampleProducts = [
        {
            title: "Cotton Shirt",
            price: 799,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
            description: "A comfortable cotton shirt perfect for casual wear. Made with 100% organic cotton.",
            category: "men",
            sizes: JSON.stringify(["S", "M", "L", "XL"]),
            colors: JSON.stringify(["White", "Blue", "Black"])
        },
        {
            title: "Slim Fit Jeans",
            price: 1299,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
            description: "Modern slim fit jeans that offer comfort and style for everyday wear.",
            category: "men",
            sizes: JSON.stringify(["28", "30", "32", "34", "36"]),
            colors: JSON.stringify(["Dark Blue", "Light Blue", "Black"])
        },
        {
            title: "Sneakers",
            price: 1999,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
            description: "Comfortable and stylish sneakers perfect for daily activities.",
            category: "shoes",
            sizes: JSON.stringify(["7", "8", "9", "10", "11"]),
            colors: JSON.stringify(["White", "Black", "Grey"])
        },
        {
            title: "Summer Dress",
            price: 1499,
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
            description: "Light and airy summer dress perfect for warm weather occasions.",
            category: "women",
            sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
            colors: JSON.stringify(["Floral", "Solid Blue", "White"])
        },
        {
            title: "Casual T-Shirt",
            price: 599,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
            description: "Basic cotton t-shirt that's perfect for layering or wearing alone.",
            category: "unisex",
            sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
            colors: JSON.stringify(["White", "Black", "Grey", "Navy"])
        },
        {
            title: "Denim Jacket",
            price: 2999,
            image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=500&fit=crop",
            description: "Classic denim jacket that never goes out of style. Perfect for layering.",
            category: "unisex",
            sizes: JSON.stringify(["S", "M", "L", "XL"]),
            colors: JSON.stringify(["Light Denim", "Dark Denim", "Black"])
        }
    ];

    const query = "INSERT INTO products (title, price, image, description, category, sizes, colors, sku) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    for (const [index, product] of sampleProducts.entries()) {
        const sku = `SKU-${1000 + index}`;
        await client.query(query, [product.title, product.price, product.image, product.description, product.category, product.sizes, product.colors, sku]);
    }
    console.log('Sample products inserted successfully.');
  }

  getDb() {
    return this.pool;
  }
}

module.exports = new Database();
