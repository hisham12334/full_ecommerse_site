class ProductController {
  constructor(db) {
    this.db = db;
  }

  // Get all products
  async getAllProducts(req, res) {
    this.db.all("SELECT * FROM products ORDER BY created_at DESC", (err, products) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch products' });
      }
      
      // Parse JSON strings back to arrays
      const formattedProducts = products.map(product => ({
        ...product,
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]')
      }));
      
      res.json(formattedProducts);
    });
  }

  // Get single product
  async getProductById(req, res) {
    const { id } = req.params;
    
    this.db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Parse JSON strings back to arrays
      const formattedProduct = {
        ...product,
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]')
      };
      
      res.json(formattedProduct);
    });
  }

  // Create product (admin only)
  async createProduct(req, res) {
    const { title, price, image, description, category, sizes, colors, stock } = req.body;

    if (!title || !price || !image) {
      return res.status(400).json({ error: 'Title, price, and image are required' });
    }

    this.db.run(
      "INSERT INTO products (title, price, image, description, category, sizes, colors, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, price, image, description, category, JSON.stringify(sizes || []), JSON.stringify(colors || []), stock || 100],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create product' });
        }
        
        res.status(201).json({
          success: true,
          productId: this.lastID,
          message: 'Product created successfully'
        });
      }
    );
  }

  // Update product (admin only)
  async updateProduct(req, res) {
    const { id } = req.params;
    const { title, price, image, description, category, sizes, colors, stock } = req.body;

    this.db.run(
      "UPDATE products SET title = ?, price = ?, image = ?, description = ?, category = ?, sizes = ?, colors = ?, stock = ? WHERE id = ?",
      [title, price, image, description, category, JSON.stringify(sizes || []), JSON.stringify(colors || []), stock, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update product' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({
          success: true,
          message: 'Product updated successfully'
        });
      }
    );
  }

  // Delete product (admin only)
  async deleteProduct(req, res) {
    const { id } = req.params;

    this.db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete product' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    });
  }
}

module.exports = ProductController;