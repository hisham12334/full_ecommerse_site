// backend/src/controllers/paymentController.js

const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentController {
  constructor(db) {
    this.db = db;
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create payment intent
  async createPaymentIntent(req, res) {
    try {
      const { amount, currency = 'INR', orderId } = req.body;

      if (!amount || !orderId) {
        return res.status(400).json({ error: 'Order ID and amount are required' });
      }

      const options = {
        amount: Math.round(amount * 100), // Razorpay requires amount in paise (integer)
        currency,
        receipt: `receipt_order_${orderId}`,
        payment_capture: 1, // Auto capture
      };

      const razorpayOrder = await this.razorpay.orders.create(options);

      res.json({
        id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
      });
    } catch (error) {
      console.error('Failed to create Razorpay payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }

  // Confirm payment with Idempotency Check
  async confirmPayment(req, res) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
    
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      // Lock the order row to prevent race conditions from concurrent requests
      const orderResult = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
      
      if (orderResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = orderResult.rows[0];

      // IDEMPOTENCY CHECK: If payment is already confirmed, do nothing further.
      if (order.payment_status === 'paid') {
        await client.query('COMMIT'); // Commit to release the lock
        return res.json({ success: true, message: 'Payment has already been confirmed for this order.' });
      }

      // Verify the signature from Razorpay
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpay_signature) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid signature. Payment verification failed.' });
      }

      // If signature is valid and status is pending, update the order
      await client.query(
          "UPDATE orders SET payment_id = $1, payment_status = 'paid', razorpay_order_id = $2 WHERE id = $3", 
          [razorpay_payment_id, razorpay_order_id, orderId]
      );

      await client.query('COMMIT');
      res.json({ success: true, message: 'Payment confirmed and order updated successfully.' });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to confirm payment:', error);
      res.status(500).json({ error: 'Failed to confirm payment due to a server error.' });
    } finally {
      client.release();
    }
  }

  // Get payment history (Admin only - placeholder)
  async getPaymentHistory(req, res) {
    try {
      // TODO: Implement fetching payment history from the database
      const payments = [];
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payment history' });
    }
  }
}

module.exports = PaymentController;