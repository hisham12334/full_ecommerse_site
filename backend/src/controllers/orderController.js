class OrderController {
  constructor(db) {
    this.db = db;
  }

  // Create order
  async createOrder(req, res) {
    const { items, total, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || !total || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const query = "INSERT INTO orders (user_id, items, total, shipping_address) VALUES ($1, $2, $3, $4) RETURNING id";
      const values = [userId, items, total, shippingAddress];
      
      const result = await this.db.query(query, values);
      const newOrderId = result.rows[0].id;
      
      res.status(201).json({
        success: true,
        orderId: newOrderId,
        message: 'Order placed successfully'
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  // Get user orders
  async getUserOrders(req, res) {
    const userId = req.user.id;
    try {
      const result = await this.db.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Get all orders (admin only)
  async getAllOrders(req, res) {
    try {
      const query = `
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `;
      const result = await this.db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    try {
      const result = await this.db.query("UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *", [status, id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
}

module.exports = OrderController;