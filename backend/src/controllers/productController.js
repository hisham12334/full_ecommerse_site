class ProductController {
  constructor(db) {
    this.db = db;
  }

  // Get all products
  async getAllProducts(req, res) {
    try {
      const result = await this.db.query("SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC");
      // The 'pg' driver automatically parses JSONB, so no extra formatting is needed.
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // Get single product
  async getProductById(req, res) {
    const { id } = req.params;
    
    try {
      const result = await this.db.query("SELECT * FROM products WHERE id = $1 AND status = 'active'", [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Create product (admin only)
  async createProduct(req, res) {
    const { title, price, description, category, sizes, colors, stock_quantity, sku } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.path}` : '';

    if (!title || !price || !imagePath) {
      return res.status(400).json({ error: 'Title, price, and image are required' });
    }

    try {
        const query = `
            INSERT INTO products (title, price, image, description, category, sizes, colors, stock_quantity, sku) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING id
        `;
        const values = [
            title, 
            parseInt(price), 
            imagePath, 
            description, 
            category, 
            sizes ? JSON.parse(sizes) : [], 
            colors ? JSON.parse(colors) : [], 
            parseInt(stock_quantity) || 0, 
            sku
        ];

        const result = await this.db.query(query, values);
        res.status(201).json({
            success: true,
            productId: result.rows[0].id,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Failed to create product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
  }

  // Update product (admin only)
  async updateProduct(req, res) {
    const { id } = req.params;
    const { title, price, description, category, sizes, colors, stock_quantity, sku, status } = req.body;
    
    // This approach is more secure and robust for updates
    const fields = { title, price, description, category, sizes, colors, stock_quantity, sku, status };
    if (req.file) {
      fields.image = `/uploads/${req.file.path}`;
    }

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            let processedValue = value;
            if (key === 'sizes' || key === 'colors') {
                processedValue = JSON.parse(value);
            }
            setClauses.push(`${key} = $${paramIndex}`);
            values.push(processedValue);
            paramIndex++;
        }
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No fields to update provided' });
    }

    values.push(id); // For the WHERE clause
    const query = `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    try {
        const result = await this.db.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ success: true, message: 'Product updated successfully', product: result.rows[0] });
    } catch (error) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
  }

  // Delete product (admin only)
  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
        const result = await this.db.query("DELETE FROM products WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}

module.exports = ProductController;