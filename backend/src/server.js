// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, initializeTables } = require('./config/database');

// Import routes and middleware
const createAuthRoutes = require('./routes/auth');
const createProductRoutes = require('./routes/products');
const createOrderRoutes = require('./routes/orders');
const createAdminRoutes = require('./routes/admin');
const createPaymentRoutes = require('./routes/payments');
const { errorHandler, notFound } = require('./middleware/errorHandler');

async function startServer() {
  // 1. Await a successful database connection
  const db = await connectToDatabase();
  // 2. Await successful table initialization
  await initializeTables(db);

  console.log("Database is ready. Initializing Express server...");

  const app = express();
  const PORT = process.env.PORT || 5000;

  // 3. Configure middleware
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());

  // 4. Configure routes
  app.use('/api/auth', createAuthRoutes(db));
  app.use('/api/products', createProductRoutes(db));
  app.use('/api/orders', createOrderRoutes(db));
  app.use('/api/admin', createAdminRoutes(db));
  app.use('/api/payments', createPaymentRoutes(db));

  // 5. Configure error handling
  app.use(errorHandler);
  app.use(notFound);

  // 6. Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
  });
}

startServer();