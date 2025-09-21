// backend/src/controllers/adminController.js

class AdminController {
  constructor(db) {
    this.db = db;
  }

  // DASHBOARD
  async getDashboardStats(req, res) {
    try {
      const [ordersResult, productsResult, usersResult, revenueResult] = await Promise.all([
        this.db.query("SELECT COUNT(*) as count FROM orders"),
        this.db.query("SELECT COUNT(*) as count FROM products"),
        this.db.query("SELECT COUNT(*) as count FROM users"),
        this.db.query("SELECT SUM(total) as revenue FROM orders WHERE payment_status = 'completed'")
      ]);
      const stats = {
        totalOrders: parseInt(ordersResult.rows[0].count),
        totalProducts: parseInt(productsResult.rows[0].count),
        totalUsers: parseInt(usersResult.rows[0].count),
        totalRevenue: parseInt(revenueResult.rows[0].revenue) || 0
      };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }

  // USER MANAGEMENT
  async getAllUsers(req, res) {
    try {
      const result = await this.db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    try {
      const result = await this.db.query("UPDATE users SET role = $1 WHERE id = $2", [role, id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true, message: 'User role updated' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const result = await this.db.query("DELETE FROM users WHERE id = $1", [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true, message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  // PRODUCT MANAGEMENT
  async getAllProducts(req, res) {
    try {
      const query = `
        SELECT p.*, json_agg(json_build_object('id', pv.id, 'size', pv.size, 'sku', pv.sku, 'quantity', pv.quantity)) as variants
        FROM products p
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        GROUP BY p.id ORDER BY p.created_at DESC;
      `;
      const result = await this.db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async createProduct(req, res) {
    const { title, price, description, category, colors, variants } = req.body;
    const imagePath = req.file ? req.file.path : '';

    // Enhanced validation
    if (!title || !price || !imagePath) {
      return res.status(400).json({ error: 'Title, price, and image are required' });
    }

    if (!variants) {
      return res.status(400).json({ error: 'Variants data is required' });
    }

    let parsedVariants;
    let parsedColors;

    try {
      // Parse variants
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      
      // Parse colors - handle both string and already parsed data
      if (colors) {
        if (typeof colors === 'string') {
          try {
            parsedColors = JSON.parse(colors);
          } catch (e) {
            // If JSON parsing fails, treat as comma-separated string
            parsedColors = colors.split(',').map(c => c.trim()).filter(Boolean);
          }
        } else {
          parsedColors = colors;
        }
      } else {
        parsedColors = [];
      }
      
      // Ensure parsedColors is an array
      if (!Array.isArray(parsedColors)) {
        parsedColors = [];
      }

      // Validate variants
      if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
        return res.status(400).json({ error: 'At least one variant is required' });
      }

      // Check if at least one variant has valid data
      const hasValidVariant = parsedVariants.some(variant => 
        variant.sku && variant.sku.trim() && 
        variant.quantity !== undefined && 
        parseInt(variant.quantity) >= 0
      );

      if (!hasValidVariant) {
        return res.status(400).json({ error: 'At least one variant must have a valid SKU and quantity' });
      }

    } catch (parseError) {
      console.error('Error parsing request data:', parseError);
      console.error('Raw colors data:', colors);
      console.error('Raw variants data:', variants);
      return res.status(400).json({ error: 'Invalid data format for variants or colors' });
    }

    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Insert product
      const productQuery = `
        INSERT INTO products (title, price, image, description, category, colors) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
      `;
      const productValues = [
        title.trim(), 
        parseFloat(price), 
        imagePath, 
        description ? description.trim() : '', 
        category || '', 
        JSON.stringify(parsedColors) // Convert array to JSON string
      ];
      
      // Debug logging
      console.log('Product values being inserted:', {
        title: title.trim(),
        price: parseFloat(price),
        image: imagePath,
        description: description ? description.trim() : '',
        category: category || '',
        colors: JSON.stringify(parsedColors),
        parsedColors: parsedColors
      });
      
      const productResult = await client.query(productQuery, productValues);
      const productId = productResult.rows[0].id;

      // Insert variants
      const variantQuery = `
        INSERT INTO product_variants (product_id, size, sku, quantity) 
        VALUES ($1, $2, $3, $4)
      `;
      
      for (const variant of parsedVariants) {
        // Only insert variants with valid SKU and quantity
        if (variant.sku && variant.sku.trim() && variant.quantity !== undefined) {
          const quantity = parseInt(variant.quantity) || 0;
          await client.query(variantQuery, [
            productId, 
            variant.size || 'Unknown', 
            variant.sku.trim(), 
            quantity
          ]);
        }
      }

      await client.query('COMMIT');
      res.status(201).json({ 
        success: true, 
        productId, 
        message: 'Product and variants created successfully' 
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to create product:', error);
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ 
          error: `SKU already exists. Please use unique SKUs for all variants.` 
        });
      }
      
      if (error.code === '22P02') { // Invalid input syntax
        return res.status(400).json({ 
          error: 'Invalid data format. Please check your input values.' 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create product. Please try again.' 
      });
    } finally {
      client.release();
    }
  }
  
  async updateProduct(req, res) {
    const { id } = req.params;
    const { title, price, description, category, colors, variants, status } = req.body;
    const imagePath = req.file ? req.file.path : null;

    let parsedVariants;
    let parsedColors;

    try {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        if (colors) {
            if (typeof colors === 'string') {
                try {
                    parsedColors = JSON.parse(colors);
                } catch (e) {
                    parsedColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                }
            } else {
                parsedColors = colors;
            }
        } else {
            parsedColors = [];
        }
    } catch (parseError) {
        return res.status(400).json({ error: 'Invalid data format for variants or colors' });
    }

    const client = await this.db.connect();
    try {
        await client.query('BEGIN');

        const productFields = { title, price, description, category, status, colors: JSON.stringify(parsedColors) };
        if (imagePath) {
            productFields.image = imagePath;
        }

        const setClauses = Object.keys(productFields)
            .filter(key => productFields[key] !== undefined)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(', ');

        if (setClauses) {
            const values = Object.values(productFields).filter(v => v !== undefined);
            values.push(id);
            const productUpdateQuery = `UPDATE products SET ${setClauses} WHERE id = $${values.length} RETURNING *`;
            await client.query(productUpdateQuery, values);
        }

        // Update variants
        const variantUpdateQuery = `
            INSERT INTO product_variants (product_id, size, sku, quantity)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (product_id, size) 
            DO UPDATE SET sku = EXCLUDED.sku, quantity = EXCLUDED.quantity;
        `;

        for (const variant of parsedVariants) {
            if (variant.sku && variant.sku.trim()) {
                await client.query(variantUpdateQuery, [id, variant.size, variant.sku.trim(), variant.quantity || 0]);
            }
        }
        
        await client.query('COMMIT');
        res.json({ success: true, message: 'Product updated successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to update product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    } finally {
        client.release();
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
        // The ON DELETE CASCADE on the variants table will handle cleanup
        const result = await this.db.query("DELETE FROM products WHERE id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
  }
  
  // ORDER MANAGEMENT
  async getAllOrders(req, res) {
    try {
      const result = await this.db.query(`
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async updateOrderStatus(req, res) {
    const { id } = req.params;
    const { order_status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!order_status || !validStatuses.includes(order_status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    try {
      const result = await this.db.query(
        "UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *", 
        [order_status, id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Order status updated successfully',
        order: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
}

module.exports = AdminController;