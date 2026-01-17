// backend/src/services/orderCancellationService.js

/**
 * Service responsible for automatically cancelling expired pending orders
 * and restoring their inventory back to available stock
 */
class OrderCancellationService {
  /**
   * Initialize the Order Cancellation Service
   * @param {Object} db - Database pool instance
   * @param {Object} logger - Logger instance
   */
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  /**
   * Find all pending orders that have exceeded the 15-minute timeout period
   * @returns {Promise<Array>} Array of expired order objects
   */
  async findExpiredOrders() {
    const query = `
      SELECT 
        id, 
        user_id, 
        items, 
        total, 
        created_at
      FROM orders
      WHERE order_status = 'pending'
        AND created_at < NOW() - INTERVAL '15 minutes'
      ORDER BY created_at ASC
    `;

    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to query expired orders', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Restore stock quantities for all items in an order
   * @param {Object} client - Database client (for transaction)
   * @param {Array} items - Order items array
   * @returns {Promise<void>}
   */
  async restoreStock(client, items) {
    for (const item of items) {
      const updateQuery = `
        UPDATE product_variants
        SET quantity = quantity + $1
        WHERE id = $2
      `;

      await client.query(updateQuery, [item.quantity, item.variant_id]);

      this.logger.info('Stock restored for product variant', {
        variant_id: item.variant_id,
        sku: item.sku,
        quantity_restored: item.quantity,
        product_title: item.title
      });
    }
  }

  /**
   * Cancel a single order and restore its stock within a transaction
   * @param {Object} order - Order object from database
   * @returns {Promise<boolean>} Success status
   */
  async cancelOrder(order) {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Update order status to cancelled
      const updateOrderQuery = `
        UPDATE orders
        SET 
          order_status = 'cancelled',
          cancelled_at = CURRENT_TIMESTAMP,
          cancellation_reason = 'Payment timeout - order not paid within 15 minutes',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;

      await client.query(updateOrderQuery, [order.id]);

      // Parse items from JSONB
      const items = typeof order.items === 'string' 
        ? JSON.parse(order.items) 
        : order.items;

      // Restore stock for all items
      await this.restoreStock(client, items);

      await client.query('COMMIT');

      this.logger.info('Order cancelled successfully', {
        orderId: order.id,
        userId: order.user_id,
        itemCount: items.length,
        total: order.total
      });

      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      
      this.logger.error('Failed to cancel order', {
        orderId: order.id,
        userId: order.user_id,
        error: error.message,
        stack: error.stack
      });

      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Main method to find and cancel all expired pending orders
   * @returns {Promise<Object>} Summary of cancellation operation
   */
  async cancelExpiredOrders() {
    const startTime = Date.now();
    
    const summary = {
      processedCount: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
      executionTime: 0
    };

    this.logger.info('Starting order cancellation job');

    try {
      const expiredOrders = await this.findExpiredOrders();

      if (expiredOrders.length === 0) {
        this.logger.info('No expired orders found');
        summary.executionTime = Date.now() - startTime;
        return summary;
      }

      this.logger.info(`Found ${expiredOrders.length} expired orders to process`);

      for (const order of expiredOrders) {
        summary.processedCount++;

        try {
          await this.cancelOrder(order);
          summary.successCount++;
        } catch (error) {
          summary.failureCount++;
          summary.errors.push({
            orderId: order.id,
            error: error.message
          });

          this.logger.error('Failed to cancel order', {
            orderId: order.id,
            error: error.message,
            stack: error.stack
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to query expired orders', {
        error: error.message,
        stack: error.stack
      });
    }

    summary.executionTime = Date.now() - startTime;

    this.logger.info('Order cancellation job completed', {
      processedCount: summary.processedCount,
      successCount: summary.successCount,
      failureCount: summary.failureCount,
      executionTimeMs: summary.executionTime
    });

    return summary;
  }
}

module.exports = OrderCancellationService;
