const express = require('express');
const PaymentController = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const createPaymentRoutes = (db) => {
  const router = express.Router();
  const paymentController = new PaymentController(db);

  // Create payment intent (authenticated users)
  router.post('/create-intent', authenticateToken, (req, res) => paymentController.createPaymentIntent(req, res));

  // Confirm payment (authenticated users)
  router.post('/confirm', authenticateToken, (req, res) => paymentController.confirmPayment(req, res));

  // Get payment history (admin only)
  router.get('/history', authenticateToken, requireAdmin, (req, res) => paymentController.getPaymentHistory(req, res));

  return router;
};

module.exports = createPaymentRoutes;