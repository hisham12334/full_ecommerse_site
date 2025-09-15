const express = require('express');
const OrderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const createOrderRoutes = (db) => {
  const router = express.Router();
  const orderController = new OrderController(db);

  // Create order (authenticated users)
  router.post('/', authenticateToken, (req, res) => orderController.createOrder(req, res));

  // Get user orders (authenticated users)
  router.get('/', authenticateToken, (req, res) => orderController.getUserOrders(req, res));

  // Get all orders (admin only)
  router.get('/admin/all', authenticateToken, requireAdmin, (req, res) => orderController.getAllOrders(req, res));

  // Update order status (admin only)
  router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => orderController.updateOrderStatus(req, res));

  return router;
};

module.exports = createOrderRoutes;