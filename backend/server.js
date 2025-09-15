const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./ecommerce.db');

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    category TEXT,
    sizes TEXT,
    colors TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    shipping_address TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Insert sample products if table is empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
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

      const stmt = db.prepare("INSERT INTO products (title, price, image, description, category, sizes, colors) VALUES (?, ?, ?, ?, ?, ?, ?)");
      sampleProducts.forEach(product => {
        stmt.run(product.title, product.price, product.image, product.description, product.category, product.sizes, product.colors);
      });
      stmt.finalize();
    }
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Root API route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'POST /api/auth/register', 
      'POST /api/auth/login',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/orders',
      'GET /api/orders'
    ]
  });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
      [name, email, hashedPassword], 
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
          success: true,
          user: { id: this.lastID, name, email },
          token
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products ORDER BY created_at DESC", (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    
    // Parse JSON strings back to arrays
    const formattedProducts = products.map(product => ({
      ...product,
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]')
    }));
    
    res.json(formattedProducts);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Parse JSON strings back to arrays
    const formattedProduct = {
      ...product,
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]')
    };
    
    res.json(formattedProduct);
  });
});

// Create order (protected route)
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total, shippingAddress } = req.body;
  const userId = req.user.id;

  if (!items || !total || !shippingAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    "INSERT INTO orders (user_id, items, total, shipping_address) VALUES (?, ?, ?, ?)",
    [userId, JSON.stringify(items), total, JSON.stringify(shippingAddress)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create order' });
      }
      
      res.status(201).json({
        success: true,
        orderId: this.lastID,
        message: 'Order placed successfully'
      });
    }
  );
});

// Get user orders (protected route)
app.get('/api/orders', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }
      
      const formattedOrders = orders.map(order => ({
        ...order,
        items: JSON.parse(order.items),
        shipping_address: JSON.parse(order.shipping_address)
      }));
      
      res.json(formattedOrders);
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});