// backend/src/controllers/paymentController.js

const Razorpay = require('razorpay');
const crypto = require('crypto');
const whatsappService = require('../services/whatsappService');

class PaymentController {
  constructor(db) {
    this.db = db;
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // --- HELPER METHOD ---
  // Shared logic to update DB and send notification (used by confirmPayment & handleWebhook)
  async _fulfillOrder(client, orderId, paymentId, razorpayOrderId, order) {
    // Update both payment_status and order_status to 'paid'
    await client.query(
      "UPDATE orders SET payment_id = $1, payment_status = 'paid', order_status = 'paid', razorpay_order_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3", 
      [paymentId, razorpayOrderId, orderId]
    );

    await client.query('COMMIT');

    // Send WhatsApp notification
    try {
      const shippingAddress = order.shipping_address;
      const items = order.items;
      
      if (shippingAddress && shippingAddress.phone) {
        await whatsappService.sendOrderConfirmedMessage(shippingAddress.phone, {
          orderId: order.id,
          items: items,
          total: order.total,
          shippingAddress: shippingAddress
        });
      }
    } catch (whatsappError) {
      // Log but don't fail the transaction if notification fails
      console.error('WhatsApp notification failed:', whatsappError);
    }
  }

  // --- FIX 1: SECURE PAYMENT INTENT ---
  async createPaymentIntent(req, res) {
    try {
      // REMOVED 'amount' from input to prevent manipulation
      const { orderId } = req.body;
      const userId = req.user.id; // From auth middleware

      if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
      }

      // 1. Fetch the REAL amount and ownership from Database
      const orderResult = await this.db.query(
        'SELECT id, total, user_id, payment_status FROM orders WHERE id = $1', 
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderResult.rows[0];

      // 2. Security: Ensure the user owns this order
      if (order.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access to this order' });
      }

      // 3. Prevent double payment
      if (order.payment_status === 'paid') {
         return res.status(400).json({ error: 'Order is already paid' });
      }

      const options = {
        amount: Math.round(order.total * 100), // Use DB amount (in paise)
        currency: 'INR',
        receipt: `receipt_order_${orderId}`,
        payment_capture: 1, // Auto capture
        // Critical for Webhook: Pass orderId in notes so we can retrieve it later
        notes: { 
            orderId: orderId 
        } 
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

  // --- CONFIRM PAYMENT (Frontend Flow) ---
  async confirmPayment(req, res) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
    
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      // Lock the order row to prevent race conditions
      const orderResult = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
      
      if (orderResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = orderResult.rows[0];

      // IDEMPOTENCY CHECK
      if (order.payment_status === 'paid') {
        await client.query('COMMIT');
        return res.json({ success: true, message: 'Payment has already been confirmed.' });
      }

      // Verify the signature
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpay_signature) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid signature. Payment verification failed.' });
      }

      // Fulfill the order using shared helper
      await this._fulfillOrder(client, orderId, razorpay_payment_id, razorpay_order_id, order);

      res.json({ success: true, message: 'Payment confirmed and order updated successfully.' });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to confirm payment:', error);
      res.status(500).json({ error: 'Failed to confirm payment due to a server error.' });
    } finally {
      client.release();
    }
  }

  // --- FIX 2: WEBHOOK HANDLER (Background Flow) ---
  async handleWebhook(req, res) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Verify Webhook Signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({ status: 'invalid signature' });
    }

    const event = req.body;

    // 2. Handle 'payment.captured' event
    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes.orderId; // Retrieved from notes set in createPaymentIntent
        const paymentId = payment.id;
        const razorpayOrderId = payment.order_id;

        if (!orderId) {
            console.error('Webhook received but no orderId found in notes');
            return res.status(400).json({ status: 'no orderId' });
        }

        const client = await this.db.connect();
        try {
            await client.query('BEGIN');
            
            // Lock row for update
            const orderResult = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
            
            if (orderResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.json({ status: 'order not found' }); 
            }

            const order = orderResult.rows[0];

            // Idempotency check
            if (order.payment_status === 'paid') {
                await client.query('COMMIT');
                return res.json({ status: 'already processed' });
            }

            // Fulfill order
            await this._fulfillOrder(client, orderId, paymentId, razorpayOrderId, order);
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Webhook processing failed:', error);
            // Return 500 so Razorpay retries later
            return res.status(500).json({ status: 'failed' });
        } finally {
            client.release();
        }
    }

    // Always return 200 OK to Razorpay
    res.json({ status: 'ok' });
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