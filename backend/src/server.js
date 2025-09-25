require('dotenv').config();
const express = require('express');
const cors = require('cors');


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Email transporter
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

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

// --- START: NEW CORS CONFIGURATION ---
const allowedOrigins = [
  'https://dripkult.netlify.app', // Your live frontend URL
  'http://localhost:5173'      // Your local development frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

app.use(cors(corsOptions));
// --- END: NEW CORS CONFIGURATION ---

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