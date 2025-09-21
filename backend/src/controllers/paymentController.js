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
        amount: amount * 100, // Razorpay takes amount in paise
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

  // Confirm payment
  async confirmPayment(req, res) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
    
    try {
      // Create a signature to verify
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      // Compare the generated signature with the one received
      if (digest !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // Update the order in your database
      const result = await this.db.query(
          "UPDATE orders SET payment_id = $1, payment_status = 'paid', razorpay_order_id = $2 WHERE id = $3", 
          [razorpay_payment_id, razorpay_order_id, orderId]
      );

      res.json({ success: true, message: 'Payment confirmed and order updated' });
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      res.status(500).json({ error: 'Failed to confirm payment' });
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