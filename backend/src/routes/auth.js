const express = require('express');
const AuthController = require('../controllers/authController');

const createAuthRoutes = (db) => {
  const router = express.Router();
  const authController = new AuthController(db);

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'Auth service is running!' });
  });

  // User registration
  router.post('/register', (req, res) => authController.register(req, res));

  // User login
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};

module.exports = createAuthRoutes;