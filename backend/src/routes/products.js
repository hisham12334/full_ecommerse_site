const express = require('express');
const ProductController = require('../controllers/productController');

const createProductRoutes = (db) => {
  const router = express.Router();
  const productController = new ProductController(db);

  // PUBLIC ROUTES: Anyone can view products
  router.get('/', productController.getAllProducts.bind(productController));
  router.get('/:id', productController.getProductById.bind(productController));

  // NOTE: All admin-related product routes (create, update, delete) are now in admin.js
  
  return router;
};

module.exports = createProductRoutes;