const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configurations and middleware
const database = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const createAuthRoutes = require('./routes/auth');
const createProductRoutes = require('./routes/products');
const createOrderRoutes = require('./routes/orders');
const createAdminRoutes = require('./routes/admin');
const createPaymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = database.connect();

// Routes
app.use('/api/auth', createAuthRoutes(db));
app.use('/api/products', createProductRoutes(db));
app.use('/api/orders', createOrderRoutes(db));
app.use('/api/admin', createAdminRoutes(db));
app.use('/api/payments', createPaymentRoutes(db));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Error handling middleware
app.use(errorHandler);
app.use(notFound);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;