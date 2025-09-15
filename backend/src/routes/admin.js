const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const createAdminRoutes = (db) => {
  const router = express.Router();
  const adminController = new AdminController(db);

  // All admin routes require authentication and admin role
  router.use(authenticateToken);
  router.use(requireAdmin);

  // Dashboard stats
  router.get('/dashboard/stats', (req, res) => adminController.getDashboardStats(req, res));

  // User management
  router.get('/users', (req, res) => adminController.getAllUsers(req, res));
  router.put('/users/:id/role', (req, res) => adminController.updateUserRole(req, res));
  router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));

  return router;
};

module.exports = createAdminRoutes;