const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    const dbPath = path.join(__dirname, '../../ecommerce.db');
    this.db = new sqlite3.Database(dbPath);
    this.initializeTables();
    return this.db;
  }

  initializeTables() {
    this.db.serialize(() => {
      // Users table
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Products table
      this.db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price INTEGER NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        category TEXT,
        sizes TEXT,
        colors TEXT,
        stock INTEGER DEFAULT 100,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Orders table
      this.db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        items TEXT NOT NULL,
        total INTEGER NOT NULL,
        shipping_address TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      // Insert sample products if table is empty
      this.db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row && row.count === 0) {
          this.insertSampleProducts();
        }
      });
    });
  }

  insertSampleProducts() {
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

    const stmt = this.db.prepare("INSERT INTO products (title, price, image, description, category, sizes, colors) VALUES (?, ?, ?, ?, ?, ?, ?)");
    sampleProducts.forEach(product => {
      stmt.run(product.title, product.price, product.image, product.description, product.category, product.sizes, product.colors);
    });
    stmt.finalize();
  }

  getDb() {
    return this.db;
  }
}

module.exports = new Database();