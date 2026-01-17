// backend/src/controllers/orderController.js

class OrderController {
  constructor(db) {
    this.db = db;
  }

  async createOrder(req, res) {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      const enrichedItems = [];
      let serverCalculatedTotal = 0;

      for (const item of items) {
        if (!item.variant_id) {
          throw new Error(`Item ${item.title} is missing a variant_id.`);
        }

        const productQuery = `
          SELECT
            p.id as product_id,
            p.title,
            p.price,
            p.images,
            pv.id as variant_id,
            pv.size,
            pv.sku,
            pv.quantity as stock_quantity
          FROM product_variants pv
          JOIN products p ON pv.product_id = p.id
          WHERE pv.id = $1
          FOR UPDATE;
        `;
        
        const { rows } = await client.query(productQuery, [item.variant_id]);
        
        if (rows.length === 0) {
          throw new Error(`Product variant not found for item ${item.title}. It may have been removed.`);
        }
        
        const dbProduct = rows[0];

        if (dbProduct.stock_quantity < item.quantity) {
          throw new Error(`Not enough stock for ${dbProduct.title} (Size: ${dbProduct.size}). Requested: ${item.quantity}, Available: ${dbProduct.stock_quantity}`);
        }

        serverCalculatedTotal += dbProduct.price * item.quantity;
        
        const enrichedItem = {
            productId: dbProduct.product_id,
            variant_id: dbProduct.variant_id,
            title: dbProduct.title,
            price: dbProduct.price, // Use price from DB
            image: (dbProduct.images && dbProduct.images.length > 0) ? dbProduct.images[0] : null,
            quantity: item.quantity,
            size: dbProduct.size,
            sku: dbProduct.sku,
            selectedColor: item.selectedColor, 
        };

        enrichedItems.push(enrichedItem);
      }
      
      const orderQuery = `INSERT INTO orders (user_id, items, total, shipping_address, order_status, payment_status) VALUES ($1, $2, $3, $4, 'pending', 'pending') RETURNING id`;
      const orderResult = await client.query(orderQuery, [userId, JSON.stringify(enrichedItems), serverCalculatedTotal, JSON.stringify(shippingAddress)]);
      const newOrderId = orderResult.rows[0].id;

      for (const item of enrichedItems) {
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
      const result = await this.db.query(
        `SELECT 
          id, user_id, items, total, shipping_address,
          payment_status, order_status, 
          cancelled_at, cancellation_reason,
          created_at, updated_at
        FROM orders 
        WHERE user_id = $1 
        ORDER BY created_at DESC`,
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
}

module.exports = OrderController;