const express = require('express');
const ProductController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const upload = require('../config/cloudinary'); // <-- IMPORT THE NEW UPLOADER

const createProductRoutes = (db) => {
  const router = express.Router();
  const productController = new ProductController(db);

  // Public routes
  router.get('/', productController.getAllProducts.bind(productController));
  router.get('/:id', productController.getProductById.bind(productController));

  // Admin only routes
  router.post('/', authenticateToken, requireAdmin, upload.single('image'), productController.createProduct.bind(productController));
  router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), productController.updateProduct.bind(productController));
  router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct.bind(productController));

  return router;
};

module.exports = createProductRoutes;