class OrderController {
  constructor(db) {
    this.db = db;
  }

  async createOrder(req, res) {
    const { items, total, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || !total || !shippingAddress) return res.status(400).json({ error: 'Missing required fields' });

    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      for (const item of items) {
        if (!item.variant_id) throw new Error(`Item ${item.title} is missing a variant_id.`);
        const stockResult = await client.query("SELECT quantity FROM product_variants WHERE id = $1 FOR UPDATE", [item.variant_id]);
        if (stockResult.rows.length === 0) throw new Error(`Variant for product ${item.title} not found.`);
        const currentStock = stockResult.rows[0].quantity;
        if (currentStock < item.quantity) throw new Error(`Not enough stock for ${item.title} (Size: ${item.size}). Requested: ${item.quantity}, Available: ${currentStock}`);
      }

      const orderQuery = `INSERT INTO orders (user_id, items, total, shipping_address) VALUES ($1, $2, $3, $4) RETURNING id`;
      const orderResult = await client.query(orderQuery, [userId, items, total, shippingAddress]);
      const newOrderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query("UPDATE product_variants SET quantity = quantity - $1 WHERE id = $2", [item.quantity, item.variant_id]);
      }
      
      await client.query('COMMIT');
      res.status(201).json({ success: true, orderId: newOrderId, message: 'Order placed and inventory updated.' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error processing order:', error);
      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  }
  
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
}

module.exports = OrderController;