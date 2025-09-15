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

    this.db.run(
      "INSERT INTO orders (user_id, items, total, shipping_address) VALUES (?, ?, ?, ?)",
      [userId, JSON.stringify(items), total, JSON.stringify(shippingAddress)],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create order' });
        }
        
        res.status(201).json({
          success: true,
          orderId: this.lastID,
          message: 'Order placed successfully'
        });
      }
    );
  }

  // Get user orders
  async getUserOrders(req, res) {
    const userId = req.user.id;

    this.db.all(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
      (err, orders) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch orders' });
        }
        
        const formattedOrders = orders.map(order => ({
          ...order,
          items: JSON.parse(order.items),
          shipping_address: JSON.parse(order.shipping_address)
        }));
        
        res.json(formattedOrders);
      }
    );
  }

  // Get all orders (admin only)
  async getAllOrders(req, res) {
    this.db.all(
      "SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC",
      (err, orders) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch orders' });
        }
        
        const formattedOrders = orders.map(order => ({
          ...order,
          items: JSON.parse(order.items),
          shipping_address: JSON.parse(order.shipping_address)
        }));
        
        res.json(formattedOrders);
      }
    );
  }

  // Update order status (admin only)
  async updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    this.db.run(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update order status' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({
          success: true,
          message: 'Order status updated successfully'
        });
      }
    );
  }
}

module.exports = OrderController;