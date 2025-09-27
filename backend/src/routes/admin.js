// backend/src/routes/admin.js
const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const upload = require('../config/cloudinary'); // This import is crucial

const createAdminRoutes = (db) => {
  const router = express.Router();
  const adminController = new AdminController(db);

  // All admin routes are protected
  router.use(authenticateToken);
  router.use(requireAdmin);

  // Dashboard
  router.get('/dashboard/stats', adminController.getDashboardStats.bind(adminController));

  // User Management
  router.get('/users', adminController.getAllUsers.bind(adminController));
  router.put('/users/:id/role', adminController.updateUserRole.bind(adminController));
  router.delete('/users/:id', adminController.deleteUser.bind(adminController));

  // --- START: THE FIX ---
  // The 'upload.single("image")' middleware was missing from the POST and PUT routes.
  // This is now corrected.
  
  // Product Management
  router.get('/products', adminController.getAllProducts.bind(adminController));
  router.post('/products', upload.single('image'), adminController.createProduct.bind(adminController));
  router.put('/products/:id', upload.single('image'), adminController.updateProduct.bind(adminController));
  router.delete('/products/:id', adminController.deleteProduct.bind(adminController));
  // --- END: THE FIX ---

  // Order Management
  router.get('/orders', adminController.getAllOrders.bind(adminController));
  router.put('/orders/:id/status', adminController.updateOrderStatus.bind(adminController));

  return router;
};

module.exports = createAdminRoutes;