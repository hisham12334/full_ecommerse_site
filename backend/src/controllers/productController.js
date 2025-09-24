class ProductController {
  constructor(db) {
    this.db = db;
  }

  // Get all products with their variants for the public storefront
  async getAllProducts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      const query = `
        SELECT 
          p.*, 
          json_agg(
            json_build_object(
              'id', pv.id, 
              'size', pv.size, 
              'sku', pv.sku, 
              'quantity', pv.quantity
            )
          ) as variants
        FROM products p
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        WHERE p.status = 'active'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      const result = await this.db.query(query, [limit, offset]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching products with variants:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // Get a single product with its variants
  async getProductById(req, res) {
    const { id } = req.params;
    
    try {
      const productQuery = "SELECT * FROM products WHERE id = $1 AND status = 'active'";
      const productResult = await this.db.query(productQuery, [id]);

      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const variantsQuery = "SELECT id, size, sku, quantity FROM product_variants WHERE product_id = $1 ORDER BY size";
      const variantsResult = await this.db.query(variantsQuery, [id]);

      const product = productResult.rows[0];
      product.variants = variantsResult.rows;
      
      res.json(product);
    } catch (error) {
      console.error(`Error fetching product ${id} with variants:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = ProductController;