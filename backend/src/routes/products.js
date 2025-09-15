const express = require('express');
const ProductController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const createProductRoutes = (db) => {
  const router = express.Router();
  const productController = new ProductController(db);

  // Get all products (public)
  router.get('/', (req, res) => productController.getAllProducts(req, res));

  // Get single product (public)
  router.get('/:id', (req, res) => productController.getProductById(req, res));

  // Create product (admin only)
  router.post('/', authenticateToken, requireAdmin, (req, res) => productController.createProduct(req, res));

  // Update product (admin only)
  router.put('/:id', authenticateToken, requireAdmin, (req, res) => productController.updateProduct(req, res));

  // Delete product (admin only)
  router.delete('/:id', authenticateToken, requireAdmin, (req, res) => productController.deleteProduct(req, res));

  return router;
};

module.exports = createProductRoutes;