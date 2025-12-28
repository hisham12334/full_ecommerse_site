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
  app.set('trust proxy', 1);

  // 3. Configure middleware
  // backend/src/server.js
  const allowedOrigins = [
    'http://localhost:5173',
    'https://full-ecommerse-site.vercel.app',
    'https://www.qadrfits.com', // <--- ADD THIS
    'https://qadrfits.com'      // <--- ADD THIS
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      // Allow from the main list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel preview URL from your project
      if (origin.endsWith('-hishams-projects-8e70a3e1.vercel.app')) {
        return callback(null, true);
      }

      // Block all other origins
      callback(new Error('Not allowed by CORS'));
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
  };

  app.use(cors(corsOptions));
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